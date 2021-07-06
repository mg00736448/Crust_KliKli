// app.ts
import { Application, IBoot } from 'egg';
import { mkdirSync, unlinkSync, readdirSync, rmdirSync } from 'fs';
import * as path from 'path';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';

export default class FooBoot implements IBoot {
    private readonly app: Application;


    constructor(app: Application) {
        this.app = app;
    }

    configWillLoad() {
        // Ready to call configDidLoad,
        // Config, plugin files are referred,
        // this is the last chance to modify the config.
    }

    configDidLoad() {
        // Config, plugin files have loaded.
    }

    async didLoad() {
        const { app } = this;
        try {
            const api = new ApiPromise({
                provider: new WsProvider(app.config.crust.url),
                typesBundle: typesBundleForPolkadot,
            });
            app.crustAPI = await api.isReady;
            console.log('new crust api');
        } catch (err) {
            throw (err);
        }
    }
    /**
    * 订阅消息
    * 删除指定文件和文件夹
    * 删除指定压缩包
    */
    async willReady() {
        const { app } = this;
        app.getRedis('sub').subscribe('news', (err, result) => {
            if (err) {
                throw err;
            }
            console.log(result, 'psubscribe');
        });

        app.getRedis('sub').on('message', async (channel, message) => {
            try {
                if (channel === 'news') {
                    let { folder, zipID } = JSON.parse(message);
                    if (folder) {
                        let index = folder.replace('upload_', '');
                        let newFolder = `upload_${Number(index) + 1}`;
                        let folderUrl = path.join(__dirname, `/app/public/${folder}`);
                        let newFolderUrl = path.join(__dirname, `/app/public/${newFolder}`);
                        await app.getRedis('save').set('new_folder', newFolder);
                        await app.getRedis('save').set('folder_size', 0);
                        mkdirSync(newFolderUrl);
                        readdirSync(folderUrl).forEach(item => {
                            unlinkSync(`${folderUrl}/${item}`);
                        });
                        rmdirSync(folderUrl);
                    }
                    if (zipID) {
                        let zipUrl = path.join(__dirname, `/app/public/zips/${zipID}.zip`);
                        unlinkSync(`${zipUrl}`);
                    }
                }
            } catch (e) {
                throw e;
            }
        });
    }

    async didReady() {
        // Worker is ready, can do some things
        // don't need to block the app boot.
    }

    async serverDidReady() {
        // Server is listening.
    }

    async beforeClose() {
        // Do some thing before app close.
    }
}