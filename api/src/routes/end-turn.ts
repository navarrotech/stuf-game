// Copyright © 2023 Navarrotech

import type { Request, Response, Route, Game, Player } from "../types";

import { gameIdSchema, yup } from "../schemas";
import { getGame, newSeed, updateGame } from "../game";

type RequestBody = {
    game_id: string,
}

async function handler(req: Request, res: Response): Promise<void> {
    const { game_id } = req.body as RequestBody;
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

    const isCurrentPlayer = game.current_player === session_id;
    if(!isCurrentPlayer){
        res.status(400).json({
            error: "It's not your turn",
        })
        return;
    }

    // Calculate scores
    const correctGuesses = Object
        .entries(game.current_guess)
        .filter(([key, value]) => key === value)

    const incorrectGuesses = Object
        .entries(game.current_guess)
        .filter(([key, value]) => key !== value)

    // Current player score
    game.players[playerIndex].score += correctGuesses.length
    game.players[playerIndex].detective_score += correctGuesses.length

    // Everyone else
    for(const [playerId, guess] of incorrectGuesses){
        const playerIndex = game.players.findIndex(player => player.id === playerId);
        if(playerIndex === -1){
            continue
        }

        game.players[playerIndex].score += 1
        game.players[playerIndex].deception_score += 1
    }

    // Reset parameters in the game
    game.current_player = game.players[
        (playerIndex + 1) % game.players.length
    ].id;
    
    game.round_title = getNextRoundTitle(game)
    game.current_question = null
    game.current_question_time_expiration = null
    game.current_submissions = {}
    game.current_guess = {}
    game.finished_submissions = false
    game.finished_revealing = false
    game.finished_guessing = false

    game.shuffle_seed = newSeed()
    game.round += 1

    // TODO: Should the game end or keep going?

    updateGame(game)

    res.status(200).send({
        game,
        session_id,
    });
}

const validiator = yup
    .object()
    .shape({
        game_id: gameIdSchema,
    })

export default {
    path: "/v1/end-turn",
    method: "post",
    handler,
    validiator,
} as Route

export function getNextRoundTitle(game: Game){
    const questionsDone = Object.keys(game.questions_asked)
    if(questionsDone.length === 0){
        return "Just Getting Started..."
    }

    let leadPlayer: Player | undefined = undefined,
        lastPlayer: Player | undefined = undefined,
        bestDetective: Player | undefined = undefined,
        worstDetective: Player | undefined = undefined,
        mostDeceptive: Player | undefined = undefined,
        worstDeceptive: Player | undefined = undefined

    for(const player of game.players){
        if(!leadPlayer || player.score > leadPlayer.score){
            leadPlayer = player
        }

        if(!lastPlayer || player.score < lastPlayer.score){
            lastPlayer = player
        }

        if(!bestDetective || player.detective_score > bestDetective.detective_score){
            bestDetective = player
        }

        if(!worstDetective || player.detective_score < worstDetective.detective_score){
            worstDetective = player
        }

        if(!mostDeceptive || player.deception_score > mostDeceptive.deception_score){
            mostDeceptive = player
        }

        if(!worstDeceptive || player.deception_score < worstDeceptive.deception_score){
            worstDeceptive = player
        }
    }

    const funTitles = [
        `Warming up the wizards...`,
        `Gearing Up for Glory!`,
        `The Great Shuffle is Underway!`,
        `Stretch those creative brains!`,
        `Tales of Triumph and Tragedy Unfold!`,
        `Brewing a Potent Potion of Play!`,
        `Cats are better than dogs. Fact.`
    ]

    if((leadPlayer?.score || 0) > 5){
        funTitles.push(`${ leadPlayer } is in the lead`,)
    }
    if((lastPlayer?.score || 0) > 3){
        funTitles.push(`${ lastPlayer } is fighting for their honor`,)
    }
    if((bestDetective?.detective_score || 0) > 5){
        funTitles.push(
            `${ bestDetective } is a master detective`,
            `${ bestDetective } really knows you all very well!`,
        )
    }
    if((worstDetective?.detective_score || 0) > 3){
        funTitles.push(
            `${ worstDetective } is a terrible guesser...`,
            `${ worstDetective } should not be Batman!`,
        )
    }
    if((mostDeceptive?.deception_score || 0) > 5){
        funTitles.push(
            `${ mostDeceptive } is a master of deception`,
            `${ mostDeceptive } is unstoppable!`,
        )
    }
    if((worstDeceptive?.deception_score || 0) > 1){
        funTitles.push(
            `${ worstDeceptive } dare to be extremely random this round!`,
            `${ worstDeceptive } is too predictable in this game!`,
        )
    }

    return funTitles[
        Math.floor(Math.random() * funTitles.length)
    ]
}
