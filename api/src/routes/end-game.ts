// Copyright © 2023 Navarrotech

import type { Request, Response, Route } from "../types";

import { gameIdSchema, yup } from "../schemas";
import { endGame, getGame } from "../game";

type RequestBody = {
    game_id: string,
}

async function handler(req: Request, res: Response): Promise<void> {
    const { game_id }= req.body as RequestBody;
    // Can they end the game?
    const game = await getGame(req.body);
    if(!game){
        res.status(400).json({
            message: "Game not found",
        })
        return;
    }

    if(game.players.length === 1 || game.host_id !== req.session.id){
        res.status(401).json({
            message: "You are not allowed to end this game",
        })
        return;
    }

    await endGame(game_id);

    res.sendStatus(200);
}

const validiator = yup
    .object()
    .shape({
        game_id: gameIdSchema,
    })

export default {
    path: "/v1/end",
    method: "post",
    handler,
    validiator,
} as Route