import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1625112902958_6122';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };
  config.cluster = {
    listen: {
      host: 'http://127.0.0.1:7001',
      port: 7001
    }
  };
  config.crust = {
    url: 'wss://api.decloudf.com/',
    seeds: 'easy shine timber toe genius wave hover treat nothing mix noble give',
    address: '5CVWAJkmX47r35ZpMwDE14fbuPebHkpJ5Fif9mzct5UTMw9J',
    zipSizeLimit: 5*1024*1024*1024,
    expireDate: 60*60*24*7,
    replicaCount: 5
  };
  config.security = {
    csrf: {
      ignore: ["/api/open/*"]
    },
  };
  config.multipart = {
    fileSize: '1024mb',
    fileExtensions: [
      '.doc',
      '.docx'
    ]
  };
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    }
  };
  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
