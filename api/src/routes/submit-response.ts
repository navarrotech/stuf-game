// Copyright © 2023 Navarrotech

import type { Request, Response, Route } from "../types";

import { gameIdSchema, yup } from "../schemas";
import { getGame, updateGame } from "../game";

type RequestBody = {
    game_id: string,
    submission: string,
}

async function handler(req: Request, res: Response): Promise<void> {
    const { game_id, submission } = req.body as RequestBody;
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

    if(game.current_submissions[session_id]){
        res.status(400).json({
            error: "You've already submitted",
        })
        return;
    }

    game.current_submissions[session_id] = {
        text: submission,
        player: session_id,
        revealed: false,
    };

    let everyoneSubmitted = true;
    game.players.forEach(player => {
        if(!game.current_submissions[player.id] && player.id !== game.host_id){
            everyoneSubmitted = false;
        }
    })

    game.finished_submissions = everyoneSubmitted;
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
        submission: yup
            .string()
            .typeError("Submission must be a string")
            .trim()
            .min(1, "Your answer is too short!")
            .max(100, "Your answer is too long!")
            .required("Submission is required"),
    })

export default {
    path: "/v1/submit-response",
    method: "post",
    handler,
    validiator,
} as Route
