import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    await ctx.render('index');
  }
  public async file() {
    const { ctx } = this;
    await ctx.render('file');
  }
  public async zip() {
    const { ctx } = this;
    await ctx.render('zip');
  }


}
