// Copyright © 2023 Navarrotech
import type { Socket } from "socket.io";
import type { Game } from "./types";

// Core
import { Server } from "socket.io";
import { getGame, updateGame } from "./game";

const socketsByGameId: Record<string, Socket[]> = {};

export async function closeGame(gameid: string){
    const sockets = socketsByGameId[gameid];
    if(!sockets){
        return;
    }

    for(const socket of sockets){
        socket.emit("events", { message: "Game closed.", code: "game_closed" });
    }

    delete socketsByGameId[gameid];
}

export async function emitUpdate(game: Game){
    const sockets = socketsByGameId[game.id];
    if(!sockets){
        return;
    }

    for(const socket of sockets){
        socket.emit("game", game);
    }
}

const disconnectTimersBySessionId: Record<string, ReturnType<typeof setTimeout>> = {};

export async function init(httpServer: any){
    const server = new Server(httpServer);

    server.on('connection', async (io) => {
        const gameid = io.handshake.query.game_id as string;
        const sessionId = io.handshake.query.session_id as string;
        if(!gameid){
            io.emit("errors", { message: "No game id provided.", code: "no_game_id" })
            io.disconnect();
            return;
        }
        if(!sessionId){
            io.emit("errors", { message: "No session id provided.", code: "no_session_id" })
            io.disconnect();
            return;
        }

        const game = await getGame(gameid);
        if(!game){
            io.emit("errors", { message: "Game not found.", code: "game_not_found" })
            io.disconnect();
            return;
        }

        // Handle rejoining clause
        const playerIndex = game.players.findIndex((player: any) => player?.id === sessionId);
        if(playerIndex !== -1){
            game.players[playerIndex].status = "connected";
            updateGame(game);
        }

        io.emit("game", game);

        clearTimeout(
            disconnectTimersBySessionId[sessionId]
        );
        delete disconnectTimersBySessionId[sessionId]

        // Join game
        if(!socketsByGameId[gameid]){
            socketsByGameId[gameid] = [];
        }
        socketsByGameId[gameid].push(io);

        io.on('disconnect', async () => {
            const game = await getGame(gameid);
            if(!game){
                return;
            }
            
            const playerIndex = game.players.findIndex((player: any) => player.id === sessionId);
            if(playerIndex !== -1){
                game.players[playerIndex].status = "disconnected";
                updateGame(game);
            }

            // Remove player after 2 minutes of being disconnected:
            disconnectTimersBySessionId[sessionId] = setTimeout(async () => {
                const game = await getGame(gameid);
                if(!game){
                    return;
                }
    
                // Remove player:
                game.players = game.players.filter((player: any) => player.id !== sessionId);
                delete game.current_guess[sessionId];
                delete game.current_submissions[sessionId];

                updateGame(game);
            }, 1000 * 60 * 2);

            const sockets = socketsByGameId[gameid];
            if(!sockets){
                return;
            }

            socketsByGameId[gameid] = sockets.filter(socket => socket.id !== io.id);
        })
    });

    console.log("Socket.io ready!")
    return server;
}

