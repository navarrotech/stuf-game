// Copyright © 2023 Navarrotech

// Core
import express from 'navarrotech-express'
import { init, teardown, store } from './redis'
import { init as initSocketIO } from './socketio'
import customMiddleware from './middleware'
import { routes } from './routes'

// Server
import http from "http";
import https from "https";

// Misc
import { NODE_ENV, PORT, SESSION_SECRET, USE_SSL } from './env'
import { version } from './version'

const app = express({
    routes,
    customMiddleware,
    // @ts-ignore
    store,
    sessionSettings: {
        saveUninitialized: true,
        store,
        cookie: {
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production",
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
        }
    },
    cors: NODE_ENV === "development",
    storeSettings: {},
    sessionSecret: SESSION_SECRET,
})

const server = USE_SSL
    ? https.createServer(app)
    : http.createServer(app);

initSocketIO(server)

async function gracefulShutdown(code: number = 0, err?: any){
    if(err){
        console.error(err)
    }
    await Promise.all([
        teardown(),
        server.close(),
    ])
    process.exit(code)
}

process.on('SIGTERM', () => gracefulShutdown())
process.on('SIGINT',  () => gracefulShutdown())
process.on('SIGUSR2', () => gracefulShutdown())
process.on('uncaughtException', (err) => gracefulShutdown(1, err))

Promise.all([ init() ])
    .then(() => server.listen(PORT, () => console.log(`
Server running on port ${PORT}
NODE_ENV: ${NODE_ENV}
version: ${version}

Created by Navarrotech 2023`)))
