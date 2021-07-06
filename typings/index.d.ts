import 'egg';

declare module 'egg' {
    interface Application {
        crustAPI: any;
      }
}