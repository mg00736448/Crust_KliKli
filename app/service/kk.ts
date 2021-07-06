'use strict';

import { Service } from 'egg';
import { CreateOptions, WhereOptions, UpdateOptions, FindOptions } from 'sequelize';

class KK extends Service {

  async saveFile(info: CreateOptions) {
    return this.ctx.model.File.create(info);
  }
  async updateFile(params: UpdateOptions, where: WhereOptions) {
    return await this.ctx.model.File.update(params, {
      where: where
    });
  }
  async getFile(params: WhereOptions) {
    return await this.ctx.model.File.findOne({
      attributes: ['file_id', 'zip_id', 'file_type', 'cb_url', 'status', 'update_time', 'create_time'],
      where: params
    });
  }
  async getFileList(params: FindOptions) {
    return await this.ctx.model.File.findAndCountAll({
      attributes: ['file_id', 'zip_id', 'file_type', 'cb_url', 'status', 'update_time', 'create_time'],
      offset: params.offset,
      limit: params.limit,
      order: [['id', 'DESC']]
    });
  }
  async saveZip(info: CreateOptions) {
    return this.ctx.model.Zip.create(info);
  }
  async updateZip(params: UpdateOptions, where: WhereOptions) {
    return await this.ctx.model.Zip.update(params, {
      where: where
    });
  }
  async getZip(params: WhereOptions) {
    return await this.ctx.model.Zip.findOne({
      attributes: ['zip_id', 'cid', 'size', 'status', 'calculated_at', 'expired_on',  'update_time', 'create_time'],
      where: params
    });
  }
  async getZipList(params: FindOptions) {
    return await this.ctx.model.Zip.findAndCountAll({
      attributes: ['zip_id', 'cid', 'size', 'status', 'calculated_at', 'expired_on', 'update_time', 'create_time'],
      offset: params.offset,
      limit: params.limit,
      order: [['id', 'DESC']]
    });
  }

}

module.exports = KK;