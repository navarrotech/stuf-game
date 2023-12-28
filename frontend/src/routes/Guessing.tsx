// Copyright © 2023 Navarrotech
import { useState, useEffect } from "react"

import type { State } from "../redux-store/game"

import Carousel from "../common/Carousel"
import { useTheme } from "../themes"
import BannerMenu from "../common/BannerMenu"
import { submitGuess } from '../api'
import PlayerToken, { PlayerList } from "../common/PlayerToken"

type Props = {
    game: State
}

export default function Guessing({ game }: Props){
    useTheme()

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

    function getRandom(array: any[], key: string): string{
        return array[
            Math.floor(Math.random() * array.length)
        ]?.[key]
    }

    const isCurrentPlayer = mySessionId === current_player
    const host = players.find(player => player.id === current_player)
    const submissions = Object.values(current_submissions)

    const remaining = submissions.filter(submission => !current_guess[submission.player])

    const hostlessPlayers = players.filter(player => player.id !== current_player && !current_guess[player.id])

    const [ selectedPlayer, setSelectedPlayer ] = useState<string>(getRandom(hostlessPlayers, 'id'))
    const [ selectedSubmission, setSelectedSubmission ] = useState<string>(getRandom(remaining, 'player'))

    // Player leaving safety
    useEffect(() => {
        if(remaining.length === 0){
            return;
        }
        if(current_guess[selectedPlayer]){
            setSelectedPlayer(
                getRandom(hostlessPlayers, 'id')
            )
            setSelectedSubmission(
                getRandom(remaining, 'player')
            )
        }
        if(!selectedPlayer){
            setSelectedPlayer(
                getRandom(hostlessPlayers, 'id')
            )
        }
        if(!selectedSubmission){
            setSelectedSubmission(
                getRandom(remaining, 'player')
            )
        }
        // eslint-disable-next-line
    }, [ hostlessPlayers, remaining.length, selectedPlayer, selectedSubmission, remaining.length ])

    if(isCurrentPlayer){
        return <div className="container is-max-fullhd has-text-centered">
            <div className="block">
                <h1 className="title is-size-1 has-text-white">"{ current_question }"</h1>
            </div>
            <div className="block">
                <h2 className="is-size-3 has-text-white">Response</h2>
            </div>
            <div className="block">
                <Carousel
                    items={remaining}
                    keyof="player"
                    selected={selectedSubmission}
                    setSelected={setSelectedSubmission}
                    element={submission => <div className="box m-0">
                        <p className="is-size-5">{ submission.text }</p>
                    </div>}
                />
            </div>
            <div className="block">
                <h2 className="is-size-3 has-text-white">Who do you think said this?</h2>
            </div>
            <div className="block">
                <Carousel
                    items={hostlessPlayers}
                    keyof="id"
                    selected={selectedPlayer}
                    setSelected={setSelectedPlayer}
                    element={player => <PlayerToken player={player} />}
                />
            </div>
            <div className="block buttons is-centered">
                <button
                    className="button is-themed is-large"
                    type="button"
                    onClick={() => submitGuess(
                        selectedPlayer,
                        selectedSubmission
                    )}
                >
                    <span>Submit Guess!</span>
                </button>
            </div>
            <div className="block">
                <h3 className="title is-size-3 has-text-white">{ remaining.length } remaining</h3>
            </div>
        </div>
    }

    return <BannerMenu
        bannerLeft={`${host?.name || "Player"} is guessing who said what...`}
        bannerRight={`${ remaining.length } remaining`}
    >
        <div className="block">
            <h1 className="title is-size-1 has-text-white">"{ current_question }"</h1>
        </div>
        <PlayerList
            players={players}
            subtitle={player => {
                if(player.id === current_player){
                    return "⌛ Guessing..."
                }
                return current_guess[player.id] ? "✅ Guess locked in" : "Fate undecided..."
            }}
        />
    </BannerMenu>
}
