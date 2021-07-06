import * as archiver from 'archiver';
import { createWriteStream, writeFile, unlinkSync } from 'fs';
import * as path from 'path';
import { Op } from 'sequelize';
import { Keyring } from '@polkadot/keyring';
import * as StreamZip from 'node-stream-zip';



export default {
    /**
     * 打压缩包
     * 上传 ipfs
     * @param folder, ctx, app
     * @return true
     *
     */
    zip(folder: string, app: { addIPFS: any; }, cb: any) {
        const zipID = Date.now();
        const fileNamePath = `/public/zips/${zipID}.zip`;
        const target = path.join(__dirname, `..${fileNamePath}`);
        const output = createWriteStream(target);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        archive.on('error', function (err) {
            throw err;
        });
        output.on('close', async () => {
            const { cid, size } = await app.addIPFS(target);
            cb({ cid: cid.toString(), size, zipID });
        });
        archive.pipe(output);
        archive.directory(folder, false);
        archive.finalize();

    },

    /**
     * 在 crust 下单 存储
     * 更新数据库
     * @param ctx 
     * @param app 
     * @param service 
     */
    async crustOrder(ctx: any, app: any, service: any) {
        await app.crustAPI.isReadyOrError;
        //1、获取最新未下单的压缩包
        let zipInfo = await service.kk.getZip({ status: 0 });
        if (zipInfo) {
            let result = await this.placeOrder(app, zipInfo.cid, zipInfo.size, 0);
            let updateInfo = {
                status: 0,
                update_time: ~~(Date.now() / 1000)
            };
            updateInfo.status = result ? 1 : 2;
            await service.kk.updateZip(updateInfo, { zip_id: zipInfo.zip_id });
            result && this.getCrustOrderState(ctx, app, service);
            let redisSub = { zipID: zipInfo.zip_id }
            await app.getRedis('save').publish('news', JSON.stringify(redisSub));
            ctx.logger.info(`placeOrder ${result}`);
        } else {
            ctx.logger.info('no zip data to crust');
        }

    },
    /**
     * Send tx to crust network
     * @param krp On-chain identity
     * @param tx substrate-style tx
     * @returns tx already been sent
     */
    async sendTx(krp: any, tx: any) {
        return new Promise((resolve, reject) => {
            tx.signAndSend(krp, ({ events = [], status }) => {
                console.log('[tx]: Transaction status:', status.type);
                if (
                    status.isInvalid ||
                    status.isDropped ||
                    status.isUsurped ||
                    status.isRetracted
                ) {
                    reject(new Error('Invalid transaction.'));
                }

                if (status.isInBlock) {
                    events.forEach(({ event: { method, section } }) => {
                        if (section === 'system' && method === 'ExtrinsicFailed') {
                            console.log(`[tx]: Send transaction(${tx.type}) failed.`);
                            // Error with no detail, just return error
                            resolve(false);
                        } else if (method === 'ExtrinsicSuccess') {
                            console.log(`[tx]: Send transaction(${tx.type}) success.`);
                            resolve(true);
                        }
                    });
                }
            }).catch(e => {
                reject(e);
            });
        });
    },
    /**
     * Place stroage order
     * @param api chain instance
     * @param fileCID the cid of file
     * @param fileSize the size of file in ipfs
     * @param tip tip for this order
     * @return true/false
     */
    async placeOrder(app, fileCID: string, fileSize: number, tip: number) {
        const kr = new Keyring({
            type: 'sr25519'
        });
        // krp will be used in sending transaction
        const krp = kr.addFromUri(app.config.crust.seeds);
        const pso = app.crustAPI.tx.market.placeStorageOrder(fileCID, fileSize, tip);
        const txRes = JSON.parse(JSON.stringify((await this.sendTx(krp, pso))));
        return JSON.parse(JSON.stringify(txRes));
    },
    /**
     * Get on-chain order information about files
     * @param api chain instance
     * @param cid the cid of file
     * @return order state
     */
    async getCrustOrderState(ctx: any, app: any, service: any) {
        await app.crustAPI.isReadyOrError;
        let zipInfo = await service.kk.getZip({ status: 1 });
        if (zipInfo) {
            console.log(zipInfo.cid);
            let result = await app.crustAPI.query.market.files(zipInfo.cid);
            let jsonData = JSON.parse(JSON.stringify(result));
            let { expired_on, calculated_at } = jsonData[0];
            let updateInfo = {
                status: 2,
                expired_on,
                calculated_at,
                update_time: ~~(Date.now() / 1000)
            };
            if (expired_on) {
                updateInfo.status = 3,
                updateInfo.expired_on = expired_on;
            }else{
                updateInfo.status = 2;
            }
            let redisSub = { zipID: zipInfo.zip_id }
            await app.getRedis('save').publish('news', JSON.stringify(redisSub));
            await service.kk.updateZip(updateInfo, { zip_id: zipInfo.zip_id });
            ctx.logger.info("Order status: " + JSON.stringify(result));
        } else {
            ctx.logger.info('no zip data status is 2');
        }

    },
    /**
     * 检查是否有下载文件的请求
     * 获取对应压缩包的cid
     * 根据cid 获取文件
     * 下载
     */
   async checkDownFile(ctx, app, service){
       try {
        let whereInfo = {
            status: 2,
            cb_url:{
                [Op.ne]:''
            }
        };
        let fileInfo = await service.kk.getFile(whereInfo);
        if(fileInfo){
            let {  file_id, zip_id } = fileInfo;
            let zipInfo = await service.kk.getZip({zip_id});
            if(zipInfo){
                let content = await app.getIPFS(zipInfo.cid);
                let zipUrl = path.join(__dirname, `../public/down/${zip_id}.zip`);
                writeFile(zipUrl, content, async(err)=>{
                    if(!err){
                        let updateInfo = {
                            status: 3,
                            update_time: ~~(Date.now()/1000)
                        };
                        await service.kk.updateFile(updateInfo, {file_id});
                        ctx.logger.info(`down zip ${zip_id}`);
                    }
                });
            }
        }
       } catch (err) {
           throw(err);
       }
    },
    /**
     * 解压文件
     * 以json数据包post请求回调地址
     * 
     * 
     */
    async callbackUrl(ctx, app, service) {
        try {
            let { host } = app.config.cluster.listen;
            let whereInfo = {
                status: 3
            };
            let fileInfo = await service.kk.getFile(whereInfo);
            if(fileInfo){
                let { file_id, file_type, zip_id, cb_url } = fileInfo;
                let zipUrl = path.join(__dirname, `../public/down/${zip_id}.zip`);
                let outUrl = path.join(__dirname, `../public/down/`);
                let fileName = `${file_id}${file_type}`;
                const zipFile = new StreamZip({file: zipUrl, storeEntries: true});
                zipFile.on('ready', () => {
                    zipFile.extract(fileName, `${outUrl}${fileName}`, async(err) => {
                        ctx.logger.error(err ? 'Extract error' : 'Extracted');
                        let fileUrl = `${host}/public/down/${fileName}`;
                        await ctx.curl(cb_url, {
                            method: 'POST',
                            contentType: 'json',
                            data: {fileUrl},
                            timeout: 48000,
                            dataType:'json'
                        });
                        let updateInfo = {
                            status: 5,
                            update_time: ~~(Date.now()/1000)
                        }
                        await service.kk.updateFile(updateInfo,{file_id});
                        ctx.logger.info(`callback data ${cb_url}=>${fileUrl}`);
                        zipFile.close();
                    });
                });
               
            }else{
                ctx.logger.info('no callback data');
            }   
           } catch (err) {
               throw(err);
           }
    },
    /**
     * 删除压缩包
     * 
     */
    async delOldFile(ctx, app, service) {
        try {
            let whereInfo = {
                status: 5
            };
            let fileInfo = await service.kk.getFile(whereInfo);
            if(fileInfo){
                let {  file_id, file_type, zip_id, update_time } = fileInfo;
                let now = ~~(Date.now()/1000);
                let { expireDate } = app.config.crust;
                if(now-update_time >= expireDate){
                    let zipUrl = path.join(__dirname, `/app/public/down/${zip_id}.zip`);
                    let fileUrl = path.join(__dirname, `/app/public/down/${file_id}${file_type}`);
                    unlinkSync(`${zipUrl}`);
                    unlinkSync(`${fileUrl}`);
                    ctx.logger.info(`del old file ${file_id} ${zip_id}`);
                }
            }
           } catch (err) {
               throw(err);
           }
    }
}