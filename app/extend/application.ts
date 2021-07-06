import { Application, Singleton } from 'egg';
import { Redis } from 'ioredis';
import * as fs from 'fs';
import { create } from 'ipfs-http-client';

const ipfs = create();

declare module 'egg' {
    interface Application {
        addIPFS(path?: string);
        getIPFS(cid?: string);
        rmIPFS(cid?: string);
        getRedis(name?: string): Redis;
    }
}

export default {
    async addIPFS(target: string) {
        let content = await fs.readFileSync(target);
        return await ipfs.add(content);
    },
    async getIPFS(this: Application, cid = '') {
        const content: any = [];
        for await (const file of ipfs.get(cid)) {
            if (!file.content) continue;

            for await (const chunk of file.content) {
                content.push(chunk);
            }
        }
        return Buffer.concat(content);
    },
    async rmIPFS(cid=''){
        return await ipfs.files.rm(cid);
    },
    getRedis(this: Application, name = 'save') {
        return (this.redis as Singleton<Redis>).get(name);
    }
};