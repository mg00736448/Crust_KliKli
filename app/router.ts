import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const { home, api } = controller;
  router.get('/', home.index);
  router.get('/file', home.file);
  router.get('/zip', home.zip);
  

  router.post('/api/test/upload', api.uploadFile);
  router.post('/api/test/uploadAPI', api.uploadAPI);
  router.get('/api/test/fileList', api.fileList);
  router.get('/api/test/zipList', api.zipList);

  router.post('/api/open/upload', api.uploadFile);
  router.post('/api/open/downFile', api.downFile);

};
