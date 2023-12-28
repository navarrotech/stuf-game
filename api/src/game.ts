// Copyright © 2023 Navarrotech

import type { Game, Player } from "./types";

import redis, { makeUniqueGameId } from "./redis";
import { emitUpdate, closeGame } from "./socketio";

export async function newGame(host_id: string): Promise<Game> {
    const gameid = await makeUniqueGameId();
    const game: Game = {
        id: gameid,
        questions_asked: {},
        host_id: host_id,
        players: [],

        started: false,
        ended: false,

        round_title: 'Just Getting Started...',
        current_player: null,
        current_question: null,
        current_question_time_expiration: null,
        current_submissions: {},
        current_guess: {},
        finished_submissions: false,
        finished_revealing: false,
        finished_guessing: false,

        shuffle_seed: newSeed(),

        settings: {
            allow_nsfw: false,
            password: null,
            max_rounds: null,
            max_players: null,
            time_per_round: null,
        },

        round: 0,
        time_started: 0,
        time_last_updated: 0,
    }

    await updateGame(game);

    return game;
}

export async function joinGame(id: string, name: string, image: string, game_id: string): Promise<Game | undefined> {
    const player: Player = {
        id,
        image,
        name,
        score: 0,
        detective_score: 0,
        deception_score: 0,
        answers: {},
        status: "connected",
        ready: false,
    }

    const game = await getGame(game_id);
    if(!game){
        return;
    }

    game.players.push(player);

    await updateGame(game);
    emitUpdate(game);

    return game;
}

export async function getGame(game_id: string): Promise<Game | undefined> {
    const game = await redis.get('game:' + game_id);
    if (!game) {
        return;
    }
    return JSON.parse(game);
}

export async function updateGame(game: Game): Promise<void> {
    game.time_last_updated = Date.now();
    redis.set(`game:${game.id}`, JSON.stringify(game))
    emitUpdate(game);
}

export async function endGame(game_id: string): Promise<void> {
    redis.del(`game:${game_id}`)
    closeGame(game_id);
}

export function newSeed(){
    return Math.round(
        Math.random() * 10_000_000_000_000_000
    )
}
