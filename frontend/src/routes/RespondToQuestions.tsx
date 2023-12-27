// Copyright © 2023 Navarrotech
import { useState } from "react"

import type { State } from "../redux-store/game"

import { useTheme } from "../themes"
import { PlayerList } from "../common/PlayerToken"
import BannerMenu from "../common/BannerMenu"

type Props = {
    game: State
}

export default function RespondToQuestions({ game }: Props){

    const [ response, setResponse ] = useState<string>("")
    const [ loading, setLoading ] = useState<boolean>(false)

    const { mySessionId } = game
    const {
        host_id,
        players,

        current_question,
        current_submissions

    } = game.data

    useTheme()

    async function submit(){
        setLoading(true)
        
    }

    if(host_id !== mySessionId){
        return <div className="container is-max-desktop has-text-centered">
            <div className="block">
                <h1 className="title is-size-1 has-text-white">{ current_question }</h1>
            </div>
            {/* TODO: Progressbar here */}
            <div className="field">
                <div className="control">
                    <input
                        autoFocus
                        className="input is-large"
                        type="text"
                        placeholder="Your answer here..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === "Enter"){
                                submit()
                            }
                        }}
                    />
                </div>
            </div>
            <div className="block buttons is-centered are-large">
                <button
                    className={"button is-themed" + (loading ? " is-loading" : "")}
                    type="button"
                    disabled={!response}
                    onClick={submit}
                >
                    <span>Submit!</span>
                </button>
            </div>
        </div>
    }

    return <BannerMenu
        bannerLeft="Collecting responses..."
    >
        <h1 className="title is-size-1 has-text-white">{ current_question }</h1>
        {/* TODO: Progressbar here */}
        <PlayerList 
            players={players}
            subtitle={(player) => {
                if(player.id === host_id){
                    return "Collecting responses"
                }
                return current_submissions[player.id] 
                    ? "Responded" 
                    : "Thinking..."
            }}
        />
    </BannerMenu>
}