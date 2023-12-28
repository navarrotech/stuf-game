// Copyright © 2023 Navarrotech
import { useEffect, useState } from "react"

import type { State } from "../redux-store/game"

// UI
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { PlayerList } from "../common/PlayerToken"
import BannerMenu from "../common/BannerMenu"

// Functionality
import { useTheme } from "../themes"
import { useQuestions } from "../common/questions"
import { chooseQuestion } from "../api"

type Props = {
    game: State
}

export default function ChooseCard({ game }: Props){
    const [ chosenQuestion, setChosenQuestion ] = useState<string | undefined>(undefined)
    const player = game.data.players.find(player => player.id === game.data.current_player)

    async function submit(){
        if(!chosenQuestion){
            return
        }

        await chooseQuestion(chosenQuestion)
    }

    useEffect(() => {
        if(!chosenQuestion){
            return;
        }
    
        function listener(event: KeyboardEvent){
            if(event.key === "Enter"){
                submit()
            }
        }

        window.addEventListener("keydown", listener)

        return () => {
            window.removeEventListener("keydown", listener)
        }
    
        // eslint-disable-next-line
    }, [ chosenQuestion ])

    useTheme()

    const newQuestions = useQuestions(game.data)

    if(game.mySessionId !== game.data.current_player){
        return <BannerMenu
            bannerLeft={`${player?.name || "Player"} is choosing a question...`}
        >
            <div className="block">
                <h1 className="title is-size-1 has-text-white">{ game.data.round_title }</h1>
            </div>
            <PlayerList
                players={game.data.players}
                highlight={game.data.current_player || undefined}
                subtitle={(player) => `${player.score} points`}
            />
        </BannerMenu>
    }

    return <div className="container is-max-fullhd has-text-centered">
        <div className="block">
            <h1 className="title is-size-1 has-text-white">Pick a question</h1>
        </div>
        <div className={`block columns question-cards ${chosenQuestion ? "has-chosen" : ""}`}>{
            newQuestions.map((question, index) => <div
                key={index}
                className="column is-one-third"
            >
                    <a
                        className={`box question-card ${chosenQuestion === question ? "is-chosen" : ""}`}
                        onClick={() => setChosenQuestion(question)}
                    >
                        <h1 className="title is-size-3">{ FormatQuestion(question) }</h1>
                    </a>
                </div>
            )
        }</div>
        { chosenQuestion && <div className="block buttons is-centered mt-6 pt-6">
            <button className="button is-themed is-large" type="button" onClick={submit}>
                <span>Choose Question</span>
                <span className="icon">
                    <FontAwesomeIcon icon={faCheck} />
                </span>
            </button>
        </div> }
    </div>
}

function FormatQuestion(question: string){
    const indexOfStuff = question.indexOf("Stuff")
    const beforeStuff = question.slice(0, indexOfStuff)
    const afterStuff = question.slice(indexOfStuff + 5)

    return <>
        <span className="has-text-weight-normal">{ beforeStuff }</span>
        <span><strong>STUFF</strong></span>
        <span className="has-text-weight-normal">{ afterStuff }</span>
    </>
}
