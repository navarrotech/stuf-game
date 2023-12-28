// Copyright © 2023 Navarrotech

import type { Route, Request, Response } from "navarrotech-express";

export type Game = {
    id: string;
    questions_asked: Record<string, boolean>;
    host_id: string;
    players: Player[];

    started: boolean;
    ended: boolean;

    round_title: string;
    current_player: string | null;
    current_question: string | null;
    current_question_time_expiration: number | null;
    current_submissions: Record<string, Submission>;
    current_guess: Record<string, string>;
    finished_submissions: boolean;
    finished_revealing: boolean;
    finished_guessing: boolean;
    shuffle_seed: number;

    settings: GameSettings;

    round: number;
    time_started: number;
    time_last_updated: number;
}

export type Submission = {
    text: string;
    player: string;
    revealed: boolean;
}

export type GameSettings = {
    allow_nsfw: boolean;
    password: string | null;
    max_rounds: number | null;
    max_players: number | null;
    time_per_round: number | null;
}

export type Player = {
    id: string;
    image: string;
    name: string;
    score: number;
    detective_score: number;
    deception_score: number;
    answers: Record<number, string>;
    status: "connected" | "disconnected";
    ready: boolean;
}

export type Question = string
export type Questions = Record<number, Question>;

export {
    Route,
    Request,
    Response,
}