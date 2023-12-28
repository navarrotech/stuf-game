// Copyright © 2023 Navarrotech

import type { Request, Response, Route } from "../types";

import { newGame } from "../game";

async function handler(req: Request, res: Response): Promise<void> {
    const session_id = req.session.id;
    const game = await newGame(session_id);

    res.status(200).json({
        game,
        session_id,
    })
}

export default {
    path: "/v1/create",
    method: "post",
    handler,
} as Route