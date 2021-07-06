// @ts-ignore
const Subscription = require('egg').Subscription;

class IpfsToCrust extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '5m', // 5分钟间隔
            type: 'worker', // 指定所有的 worker 都需要执行
            immediate: true,
            disable: false
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const { ctx, app, service } = this;
        try {
            //在crust下单
            await ctx.crustOrder(ctx, app, service);
            //检查下单状态
            await ctx.getCrustOrderState(ctx, app, service);
        } catch (error) {
            ctx.logger.error(error);
        }
    }
}
module.exports = IpfsToCrust;
