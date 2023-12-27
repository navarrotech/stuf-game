// Copyright © 2023 Navarrotech

import type { Request, Response, Route } from "../types";

import { gameIdSchema, yup } from "../schemas";
import { getGame, joinGame } from "../game";

type RequestBody = {
    game_id: string,
    name: string,
    image: string,
}

async function handler(req: Request, res: Response): Promise<void> {
    const { game_id, name, image }= req.body as RequestBody;

    // Can they join the game?
    const game = await getGame(game_id);
    if(!game){
        res.status(400).json({
            error: "Game not found",
        })
        return;
    }

    const updatedGame = await joinGame(
        req.session.id,
        name,
        image,
        game_id
    );

    res.status(200).send({
        game: updatedGame,
        session_id: req.session.id,
    });
}

const validiator = yup
    .object()
    .shape({
        game_id: gameIdSchema,
        name: yup
            .string()
            .typeError("name must be a string")
            .trim()
            .max(12, "name must be less than 12 characters")
            .min(1, "name must be at least 1 character")
            .required("name is required"),
        image: yup
            .string()
            .typeError("image must be a string")
            .max(2, "image must be less than 2 characters")
            .trim()
            .required("image is required"),
    })

export default {
    path: "/v1/join",
    method: "post",
    handler,
    validiator,
} as Route