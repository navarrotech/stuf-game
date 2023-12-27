// Copyright © 2023 Navarrotech
import { useState } from "react"

// API
import { joinGame } from "../api";

// UI
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { sprites } from "../common/sprites";
import { useTheme } from "../themes";

export default function AddPlayer(){
    const [ image, setImage ] = useState<string | undefined>()
    const [ name, setName ] = useState<string>('')

    useTheme("beige")

    async function onClick(){
        if(!image || !name){
            return
        }
        joinGame(name, image)
    }

    return <div className="container is-player-menu has-text-centered">
        <h1 className="title is-size-1 carter-one">Join Game</h1>
        <div className={`field sprites ${image ? 'has-active' : ''}`}>{
            sprites.map((sprite) => {
                return <div
                    key={sprite}
                    className={`sprite ${image === sprite ? 'is-active' : ''}`}
                    onClick={() => setImage(sprite)}
                >
                    <img src={window.location.origin + sprite} />
                </div>
            })
        }</div>
        <div className="field">
            <div className="control">
                <input
                    autoFocus
                    className="input is-medium"
                    type="text"
                    placeholder="Name"
                    maxLength={12}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => {
                        if(e.key === 'Enter'){
                            onClick()
                        }
                    }}
                />
            </div>
        </div>
        <div
            className="block buttons is-centered are-medium"
            data-tooltip={!image 
                ? 'Select a character' 
                : !name
                ? 'Enter a name' 
                : undefined
            }
        >
            <button
                className="button is-link is-fullwidth"
                type="button"
                disabled={!image || !name}
                onClick={onClick}
            >
                <span>Join Game</span>
                <span className="icon">
                    <FontAwesomeIcon icon={faPlus} />
                </span>
            </button>
        </div>
    </div>
}
