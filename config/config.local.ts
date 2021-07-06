import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'crust',
    username: 'root',
    password: 'abc123abc'
  };
  config.redis= {
    clients: {
      save: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 0,
      },
      sub: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
        db: 0,
      },
    }
  };
  return config;
};
