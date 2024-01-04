// Copyright © 2023 Navarrotech

import type { Submission } from "../types";
import type { State } from "../redux-store/game";

import { useTheme } from "../themes";
import { seededShuffle } from "../common/utils";
import { revealCard, finishRevealing } from '../api'
import { useSound, getPaperSound } from "../sounds";

type Props = {
    game: State
}

export default function RevealCards({ game }: Props){
    const [ playPaperSound ] = useSound(getPaperSound())

    useTheme()

    const {
        current_question,
        current_submissions,
        shuffle_seed,
        current_player,
        players,
    } = game.data
    const isCurrentPlayer = game.mySessionId === current_player
    const currentPlayer = players.find(player => player.id === current_player)
    const currentPlayerName = currentPlayer?.name || 'Player'

    const questions = seededShuffle<Submission>(
        Object.values(
            current_submissions
        ),
        shuffle_seed
    )

    const done = questions.filter(question => !question.revealed).length === 0

    async function reveal(player_id: string){
        if(!isCurrentPlayer || done || current_submissions[player_id].revealed){
            return
        }

        await revealCard(player_id)
    }

    return <div className="container is-fullhd has-text-centered">
        <div className="block">
            <h1 className="title is-size-1 has-text-white">Let's see what everyone wrote for</h1>
            <h2 className="subtitle is-size-3 has-text-white">"{ current_question }"</h2>
        </div>
        <div className="block submissions">{
            questions.map(question => {
                return <div
                    key={question.player}
                    className={`submission${
                        question.revealed ? ' is-revealed' : ''
                    }${
                        isCurrentPlayer ? ' is-clickable' : ''
                    }`}
                    data-tooltip={!isCurrentPlayer ? `${ currentPlayerName } will reveal` : undefined}
                    onClick={() => {
                        playPaperSound()
                        reveal(question.player)
                    }}
                >
                    <p>{ question.text }</p>
                </div>
            })
        }</div>
        { isCurrentPlayer && <div className="block buttons is-centered" style={{
            opacity: done ? 1 : 0,
            pointerEvents: done ? 'all' : 'none'
        }}>
            <button className="button is-themed is-large" type="button" onClick={finishRevealing}>
                <span>Start Matching!</span>
            </button>
        </div> }
    </div>
}