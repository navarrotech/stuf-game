// Copyright © 2023 Navarrotech

import type { Request, Response, Route, Game, Player } from "../types";

import { gameIdSchema, yup } from "../schemas";
import { getGame, updateGame } from "../game";

type RequestBody = {
    game_id: string,
}

async function handler(req: Request, res: Response): Promise<void> {
    const { game_id } = req.body as RequestBody;
    const session_id = req.session.id;

    // Can they join the game?
    const game = await getGame(game_id);
    if(!game){
        res.status(400).json({
            error: "Game not found",
        })
        return;
    }

    if(game.players.length < 2){
        res.status(400).json({
            error: "Not enough players to start the game",
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

    game.players[playerIndex].ready = true;

    // Should start the game?
    const allPlayersReady = game.players.every(player => player.ready);
    if(allPlayersReady){
        game.started = true;
        game.time_started = Date.now();
        game.current_player = game.players[0].id;
    }
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
    })

export default {
    path: "/v1/ready",
    method: "post",
    handler,
    validiator,
} as Route

export function getNextRoundTitle(game: Game){
    const questionsDone = Object.keys(game.questions_asked)
    if(questionsDone.length === 0){
        return "Just Getting Started..."
    }

    let leadPlayer: Player = undefined,
        lastPlayer: Player = undefined,
        bestDetective: Player = undefined,
        worstDetective: Player = undefined,
        mostDeceptive: Player = undefined,
        worstDeceptive: Player = undefined

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

    if(leadPlayer?.score > 5){
        funTitles.push(`${ leadPlayer } is in the lead`,)
    }
    if(lastPlayer?.score > 3){
        funTitles.push(`${ lastPlayer } is fighting for their honor`,)
    }
    if(bestDetective?.detective_score > 5){
        funTitles.push(
            `${ bestDetective } is a master detective`,
            `${ bestDetective } really knows you all very well!`,
        )
    }
    if(worstDetective?.detective_score > 3){
        funTitles.push(
            `${ worstDetective } is a terrible guesser...`,
            `${ worstDetective } should not be Batman!`,
        )
    }
    if(mostDeceptive?.deception_score > 5){
        funTitles.push(
            `${ mostDeceptive } is a master of deception`,
            `${ mostDeceptive } is unstoppable!`,
        )
    }
    if(worstDeceptive?.deception_score > 3){
        funTitles.push(
            `${ worstDeceptive } dare to be extremely random this round!`,
            `${ worstDeceptive } is too honest for this game!`,
        )
    }

    return funTitles[
        Math.floor(Math.random() * funTitles.length)
    ]
}

