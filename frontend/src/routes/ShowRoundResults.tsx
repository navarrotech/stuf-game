// Copyright © 2023 Navarrotech
import { useState } from "react";

import type { State } from "../redux-store/game";

import { useTheme } from "../themes";
import BannerMenu from "../common/BannerMenu";
import { PlayerList } from "../common/PlayerToken";
import { endTurn } from '../api'

type Props = {
    game: State;
}

export default function ShowRoundResults({ game }: Props){
    const [ show, setShow ] = useState<boolean>(false)

    const {
        mySessionId,
        data: {
            current_player,
            current_question,
            current_guess,
            current_submissions,
            players,
        }
    } = game

    const isCurrentPlayer = mySessionId === current_player
    const currentPlayer = players.find(player => player.id === current_player)

    let scoreText = "",
        scoreChange = 0

    const correctGuesses = Object
        .entries(current_guess)
        .filter(([key, value]) => key === value)

    const theme = isCurrentPlayer
        ? "blue"
        : scoreChange >= 1
            ? "green"
            : "red"

    useTheme(theme)

    if(isCurrentPlayer){
        scoreText = `You guessed ${correctGuesses.length} right and got +${correctGuesses.length * 2} points!`
    } else {
        const correctGuess = current_guess[mySessionId as string] === mySessionId
        if(correctGuess){
            scoreText = `Your answer was guessed correctly and you scored no points :(`
            scoreChange = 0
        } else {
            scoreText = `Your answer was tricky and guessed incorrectly, scoring you +1 point!`
            scoreChange = 1
        }
    }

    if(show || isCurrentPlayer){
        return <BannerMenu
            bannerLeft={scoreText}
            bannerRight={isCurrentPlayer && <button className="button is-themed is-large" type="button" onClick={endTurn}>
                <span>End turn</span>
            </button>}
        >
            <div className="block">
                <h1 className="title is-size-1 has-text-white">"{ current_question }"</h1>
            </div>
            <PlayerList
                players={players}
                subtitle={(player) => {
                    if(player.id === current_player){
                        return `Guessed ${correctGuesses.length} correctly`
                    }
                    const isCorrect = current_guess[player.id] === player.id;
                    return `${isCorrect ?'✅' : '🚫'} "${
                        current_submissions[player.id]?.text
                    }"` || ''
                }}
            />
        </BannerMenu>
    }

    return <div className="container is-fullhd has-text-centered">
        <div className="block">
            <h1 className="title is-size-1 has-text-white">"{ current_question }"</h1>
        </div>
        <h2 className="subtitle is-size-3 has-text-white mt-6">{ currentPlayer?.name || "Player" } { scoreChange === 1 ? 'incorrectly' : 'correctly' } guessed that you said:</h2>
        <div className="block box is-centered">
            <h1 className="title">"{
                current_submissions[
                    current_guess[mySessionId as string]
                ]?.text
            }"</h1>
        </div>
        <div className="block mt-6">
            <h1 className="title is-size-3 has-text-white">{ scoreText }</h1>
        </div>
        <div className="block buttons is-centered">
            <button className="button is-themed is-large" type="button" onClick={() => setShow(true)}>
                <span>View All Answers</span>
            </button>
        </div>
    </div>
}