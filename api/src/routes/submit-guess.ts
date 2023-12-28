// Copyright © 2023 Navarrotech

import type { Request, Response, Route } from "../types";

import { gameIdSchema, yup } from "../schemas";
import { getGame, updateGame } from "../game";

type RequestBody = {
    game_id: string;
    guessed_player_id: string;
    correct_player_id: string;
}

async function handler(req: Request, res: Response): Promise<void> {
    const { game_id, guessed_player_id, correct_player_id } = req.body as RequestBody;
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

    game.current_guess[guessed_player_id] = correct_player_id;

    let isFinished = true;
    Object
        .values(game.current_submissions)
        .filter(submission => submission.player !== game.host_id)
        .forEach(submission => {
            if(game.current_guess[submission.player] === undefined){
                isFinished = false;
            }
        })

    game.finished_guessing = isFinished;
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
        guessed_player_id: yup
            .string()
            .typeError("Player id must be a string")
            .trim()
            .min(1, "Player id is too short!")
            .max(100, "Player id is too long!")
            .required("Player id is required"),
        correct_player_id: yup
            .string()
            .typeError("Guess must be a string")
            .trim()
            .min(1, "Guess is too short!")
            .max(100, "Guess is too long!")
            .required("Guess is required"),
    })

export default {
    path: "/v1/guess",
    method: "post",
    handler,
    validiator,
} as Route
