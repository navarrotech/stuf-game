// Copyright © 2023 Navarrotech

import * as yup from 'yup';

export const gameIdSchema =  yup
    .string()
    .typeError("game_id must be a string")
    .trim()
    .required("game_id is required")

export {
    yup
}