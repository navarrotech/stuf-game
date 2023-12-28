// Copyright © 2023 Navarrotech

import type { Request, Response, Route } from "../types";

import { gameIdSchema, yup } from "../schemas";
import { getGame, updateGame } from "../game";

type RequestBody = {
    game_id: string,
    player_id: string,
}

async function handler(req: Request, res: Response): Promise<void> {
    const { game_id, player_id } = req.body as RequestBody;
    const session_id = req.session.id;

    const game = await getGame(game_id);
    if(!game){
        res.status(400).json({
            error: "Game not found",
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

    if(!game.current_question){
        res.status(400).json({
            error: "No question has been chosen yet",
        })
        return;
    }

    if(game.current_player !== session_id){
        res.status(400).json({
            error: "It's not your turn",
        })
        return;
    }

    game.current_submissions[player_id].revealed = true;
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
        player_id: yup
            .string()
            .typeError("player_id must be a string")
            .trim()
            .max(36, "player_id is too long")
            .required("player_id is required"),
    })

export default {
    path: "/v1/reveal-card",
    method: "post",
    handler,
    validiator,
} as Route
