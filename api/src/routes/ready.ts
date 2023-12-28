// Copyright © 2023 Navarrotech

import type { Request, Response, Route } from "../types";

import { gameIdSchema, yup } from "../schemas";
import { getGame, updateGame } from "../game";

type RequestBody = {
    game_id: string,
}

async function handler(req: Request, res: Response): Promise<void> {
    const { game_id } = req.body as RequestBody;
    const session_id = req.session.id;

    // Can they join the game?
    const game = await getGame(game_id);
    if(!game){
        res.status(400).json({
            error: "Game not found",
        })
        return;
    }

    if(game.players.length <= 2){
        res.status(400).json({
            error: "Not enough players to start the game, must have at least 3 players",
        })
        return;
    }

    const playerIndex = game.players.findIndex(player => player.id === session_id);

    if(playerIndex === -1){
        res.status(400).json({
            error: "You haven't joined the game yet",
        })
        return;
    }

    game.players[playerIndex].ready = true;

    // Should start the game?
    const allPlayersReady = game.players.every(player => player.ready);
    if(allPlayersReady){
        game.started = true;
        game.time_started = Date.now();
        game.current_player = game.players[0].id;
    }
    updateGame(game);

    res.status(200).send({
        game,
        session_id,
    });
}

const validiator = yup
    .object()
    .shape({
        game_id: gameIdSchema,
    })

export default {
    path: "/v1/ready",
    method: "post",
    handler,
    validiator,
} as Route
