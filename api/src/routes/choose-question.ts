// Copyright © 2023 Navarrotech

import type { Request, Response, Route, Game, Player } from "../types";

import { gameIdSchema, yup } from "../schemas";
import { getGame, updateGame } from "../game";

type RequestBody = {
    game_id: string,
    question: string,
}

async function handler(req: Request, res: Response): Promise<void> {
    const { game_id, question } = req.body as RequestBody;
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

    game.current_question = question;
    game.current_question_time_expiration = Date.now() + 1000 * 60 * 2;
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
        question: yup
            .string()
            .typeError("Question must be a string")
            .trim()
            .min(1, "Question must be at least 1 character")
            .max(100, "Question must be at most 100 characters")
            .required("Question is required"),
    })

export default {
    path: "/v1/choose-question",
    method: "post",
    handler,
    validiator,
} as Route
