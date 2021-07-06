// @ts-ignore
const Subscription = require('egg').Subscription;

class DownIPFS extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '11m', // 11分钟间隔
            type: 'worker', // 指定所有的 worker 都需要执行
            immediate: true,
            disable: false
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const { ctx, app, service } = this;
        try {
            //检查是否有下载任务,并下载文件
            await ctx.checkDownFile(ctx, app, service);
            //检查是否有已下载的压缩包，解压并回调
            await ctx.callbackUrl(ctx, app, service);
            //定期删除已下载的压缩包
            await ctx.delOldFile(ctx, app, service);
        } catch (error) {
            ctx.logger.error(error);
        }
    }
}
module.exports = DownIPFS;
