// Copyright © 2023 Navarrotech
import { createClient } from 'redis';
import { nanoid } from "nanoid";
import { DATABASE_URL, NODE_ENV } from './env';
import RedisStore from "connect-redis"

const client = createClient({
    url: DATABASE_URL,
});

export async function init(){
    try {
        await client.connect();
        console.log("Connected to redis successfully");
        if(NODE_ENV === "production"){
            await client.flushDb();
        }
    } catch (error: any) {
        console.error("Unable to connect to redis: ", error);
    }
}

export async function makeUniqueGameId(): Promise<string> {
    const id = nanoid(5).toLowerCase();
    const exists = await client.exists(id);
    if (exists) {
        return await makeUniqueGameId();
    }
    return id;
}

export async function teardown(){
    await client?.disconnect();
}

export const store = new RedisStore({
    client,
    prefix: "session:",
})

export default client;
