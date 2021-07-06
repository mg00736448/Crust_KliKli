import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const { home, api } = controller;
  router.get('/', home.index);
  router.get('/file', home.file);
  router.get('/zip', home.zip);
  
  router.get('/api/fileList', api.fileList);
  router.get('/api/zipList', api.zipList);
  router.post('/api/upload', api.uploadFile);
  router.post('/api/open/upload', api.uploadFile);
  router.post('/api/open/uploadAPI', api.uploadAPI);
  router.post('/api/open/downFile', api.downFile);

};
