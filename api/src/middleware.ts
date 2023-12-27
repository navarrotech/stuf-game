// Copyright © 2023 Navarrotech

import type { Request, Response } from "./types";
import type { NextFunction } from "navarrotech-express";

import { v4 as uuid } from "uuid";
import { updateLastEventReceived } from "./restart";

export async function custom(req: Request, res: Response, next: NextFunction){
    // if(!req.session?.user?.id){
    //     req.session.user = {
    //         id: uuid()
    //     }
    //     await req.session.saveAsync()
    // }
    if(req.url.startsWith("/v1/")){
        updateLastEventReceived()
    }
    next();
}

export default [
    custom,
]