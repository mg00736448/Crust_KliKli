'use strict';

import { Application } from 'egg';

export default function(app: Application) {
    const { STRING, INTEGER, TINYINT } = app.Sequelize;

    const Zip =  app.model.define('Zip', {
        zip_id: STRING(128),
        cid: STRING(128),
        size: STRING(128),
        expired_on: STRING(128),
        calculated_at: STRING(128),
        status: TINYINT,
        create_time: INTEGER,
        update_time: INTEGER,
    }, {
        freezeTableName: true,
        tableName: 'zip_ipfs_info',
        timestamps: false
    });
    return class  extends Zip {
        
    }
};