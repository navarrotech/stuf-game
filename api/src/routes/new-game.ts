// Copyright © 2023 Navarrotech

import type { Request, Response, Route } from "../types";

import { newGame } from "../game";

async function handler(req: Request, res: Response): Promise<void> {
    const host_id = req.session.id;
    const game = await newGame(host_id);

    res.status(200).json({
        game,
        host_id,
    })
}

export default {
    path: "/v1/create",
    method: "post",
    handler,
} as Route