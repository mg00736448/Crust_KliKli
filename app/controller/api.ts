import { Controller } from 'egg';

import * as fs from 'fs';
import * as path from 'path';
import * as sendToWormhole from 'stream-wormhole';
import { write } from 'await-stream-ready';
import * as FormStream from 'formstream';

export default class ApiController extends Controller {
  /**
   * 上传文件
   * 重命名
   * 累计文件大小
   * 分文件夹保存 5G为单位 5*1024*1024*1024=5368709120
   * if判断大于阈值
   * 打压缩包
   * 推送订阅消息
   * 删除指定目录和文件
   * 重新计算大小和创建新目录
   * 
   */
  public async uploadFile() {
    const { ctx, app, service } = this;
    const { zipSizeLimit } = app.config.crust;
    const { url } = ctx.request; 
    const fileID = Date.now();
    const stream = await ctx.getFileStream();
    const folder = await app.getRedis('save').get('new_folder') || 'upload_1';
    const fileType = path.extname(stream.filename).toLocaleLowerCase();
    let fileName = fileID + fileType;
    let fileNamePath = `/public/${folder}/${fileName}`;
    let target = path.join(__dirname, `..${fileNamePath}`);
    let writeStream = fs.createWriteStream(target);
    try {
      await write(stream.pipe(writeStream));
      let now = ~~(Date.now() / 1000);
      let saveDB = {
        file_id: fileID,
        file_type: fileType,
        folder_id: folder,
        status: 0,
        create_time: now
      };
      await service.kk.saveFile(saveDB);
      let totalSize = await app.getRedis('save').incrby('folder_size', writeStream.bytesWritten);
      if (totalSize >= zipSizeLimit) {
        ctx.zip(path.join(__dirname, `../public/${folder}`), app, async (result) => {
          let { cid, size, zipID, key, iv } = result;
          let updateFile = {
            zip_id: zipID,
            status: 1,
            update_time: now
          };
          await service.kk.updateFile(updateFile, { folder_id: folder });
          let zipData = {
            zip_id: zipID,
            cid,
            size,
            key,iv,
            create_time: now
          };
          await service.kk.saveZip(zipData);
          let redisSub = { folder }
          await app.getRedis('save').publish('news', JSON.stringify(redisSub));
        });
      }
      if(url.match('test')){
        ctx.redirect(`/?fileID=${fileID}`);
      }else{
        ctx.body = { code: 0, result: {fileID} };
      }
    } catch (err) {
      await sendToWormhole(stream);
      throw (err);
    }

  }

  /**
   * 下载文件请求
   * 记录回调地址和更新状态
   *
   */
  public async downFile() {
    const { ctx, service } = this;
    let { fileID = '', cbUrl = '' } = ctx.request.body;
    try {
      let fileInfo = await service.kk.getFile({ file_id: fileID });
      if (!fileInfo) {
        ctx.body = { code: 1001, result: 'fileID is error' };
        return;
      }
      let zipInfo = await service.kk.getZip({ zip_id: fileInfo.zip_id });
      if (!zipInfo) {
        ctx.body = { code: 1002, result: 'zip does not exist ' };
        return;
      }
      let updateFile = {
        cb_url: cbUrl,
        status: 2,
        update_time: ~~(Date.now() / 1000)
      };
      await service.kk.updateFile(updateFile, { file_id: fileID });
      ctx.body = { code: 0, result: 'ok' };
    } catch (err) {
      ctx.body = { code: 1000, result: 'server is error' };
      throw (err);
    }
  }

  /**
   * 测试上传文件接口
   * 
   */
  public async uploadAPI() {
    const { ctx } = this;
    const form = new FormStream();
    let fileNamePath = `/public/zips/1625397355586.zip`;
    let target = path.join(__dirname, `..${fileNamePath}`);
    form.file('file', target);
    const url = `http://127.0.0.1:7001/api/open/upload`;
    const result = await ctx.curl(url, {
      method: 'POST',
      stream: form,
      headers: form.headers(),
      dataType: 'json',
    });
    ctx.body = result;
  }

  /**
   * 获取文件列表
   * 
   */
  public async fileList() {
    const { ctx, service } = this;
    let limit: any, offset: any;
    limit = ctx.query.limit || 10;
    offset = ctx.query.offset || 1;
    let pageInfo = {
      offset: (offset - 1) * limit,
      limit: Number(limit),
    };
    let fileList = await service.kk.getFileList(pageInfo);
    ctx.body = { code: 0, result: fileList };
  }

  /**
   * 获取压缩包列表
   * 
   */
  public async zipList() {
    const { ctx, service } = this;
    let limit: any, offset: any;
    limit = ctx.query.limit || 10;
    offset = ctx.query.offset || 1;
    let pageInfo = {
      offset: (offset - 1) * limit,
      limit: Number(limit),
    };
    let zipList = await service.kk.getZipList(pageInfo);
    ctx.body = { code: 0, result: zipList };
  }
}
