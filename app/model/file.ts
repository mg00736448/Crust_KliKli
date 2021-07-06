'use strict';

import { Application } from 'egg';

export default function(app: Application) {
    const { STRING, INTEGER, TINYINT } = app.Sequelize;

    const File =  app.model.define('File', {
        file_id: STRING(128),
        file_type: STRING(128),
        folder_id: STRING(128),
        zip_id: STRING(128),
        cb_url: STRING(255),
        status: TINYINT,
        create_time: INTEGER,
        update_time: INTEGER,
    }, {
        freezeTableName: true,
        tableName: 'file_upload_info',
        timestamps: false
    });
    return class  extends File {
        
    }
};