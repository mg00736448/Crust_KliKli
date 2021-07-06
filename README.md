# crust-klikli
## 功能说明
1. 文件上传API，实时返回fileID。系统记录fileName、folder、zipName等数据。
2. 计算文件夹大小，阈值为5G。可在配置文件中修改。
3. 打压缩包，上传IPFS。系统记录cid、size等信息。
4. 定时任务 在crust下单，根据返回值更新数据状态，并删除本地存储的压缩包和文件目录。
5. 文件下载，申请文件下载，传fileID和cbUrl。
6. 定时任务 从ipfs下载压缩包，更新数据状态。
7. 定时任务 解压缩包，获取指定文件，回调cbUrl 返回文件对应的外网下载链接。
9. 定时任务 删除已下载的压缩包。
10. 后台系统可以测试上传，查看文件和压缩包列表。
11. 持续优化更新中

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+
