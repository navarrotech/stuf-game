// Copyright © 2023 Navarrotech

import type { Request, Response, Route } from "../types";

import { gameIdSchema, yup } from "../schemas";
import { getGame } from "../game";

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
    path: "/v1/get",
    method: "post",
    handler,
    validiator,
} as Route