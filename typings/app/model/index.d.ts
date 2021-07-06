// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportFile from '../../../app/model/file';
import ExportZip from '../../../app/model/zip';

declare module 'egg' {
  interface IModel {
    File: ReturnType<typeof ExportFile>;
    Zip: ReturnType<typeof ExportZip>;
  }
}
