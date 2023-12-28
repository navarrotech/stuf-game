// Copyright © 2023 Navarrotech

import type { Submission } from "../types";
import type { State } from "../redux-store/game";

import { useTheme } from "../themes";
import { seededShuffle } from "../common/utils";
import { revealCard, finishRevealing } from '../api'

type Props = {
    game: State
}

export default function RevealCards({ game }: Props){
    useTheme()

    const isHost = game.mySessionId === game.data.host_id
    const {
        current_question,
        current_submissions,
        shuffle_seed,
    } = game.data

    const questions = seededShuffle<Submission>(
        Object.values(
            current_submissions
        ),
        shuffle_seed
    )

    const done = questions.filter(question => !question.revealed).length === 0

    async function reveal(player_id: string){
        if(!isHost || !done || current_submissions[player_id].revealed){
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
                        isHost ? ' is-clickable' : ''
                    }`}
                    onClick={() => reveal(question.player)}
                >
                    <p>{ question.text }</p>
                </div>
            })
        }</div>
        { isHost && <div className="block buttons is-centered" style={{
            opacity: done ? 1 : 0,
            pointerEvents: done ? 'all' : 'none'
        }}>
            <button className="button is-themed is-large" type="button" onClick={finishRevealing}>
                <span>Start Matching!</span>
            </button>
        </div> }
    </div>
}