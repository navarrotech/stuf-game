// Copyright © 2023 Navarrotech
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

// UI
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTheme } from "../themes"

// API
import { getGame } from "../api"

export default function Welcome(){
    const navigate = useNavigate();

    const [ code, setCode ] = useState<string>('')
    const [ error, setError ] = useState<string>('')

    useEffect(() => {
        setError('')
    }, [ code ])

    useTheme("beige")

    async function submit(){
        if(code.length !== 5){
            return;
        }

        const { game, error } = await getGame(code)

        if(error){
            setError(error)
        }

        if(!game){
            return;
        }

        navigate('/game/' + game.id)
    }

    return <div className="container is-max-fullhd has-text-centered">
        <Link className="deleteBtn" to="/welcome">
            <button className="delete is-large" />
        </Link>
        <div className="miniContainer">
            <div className="block">
                <h1 className="title">Join Game:</h1>
            </div>
            <div className="field">
                <div className="control">
                    <input
                        className="input is-large"
                        type="text"
                        placeholder="Game code"
                        maxLength={5}
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        onKeyDown={e => {
                            if(e.key === 'Enter'){
                                submit()
                            }
                        }}
                    />
                </div>
            </div>
            <div className="field buttons is-centered are-medium">
                <button
                    className="button is-success is-fullwidth mb-0"
                    type="button"
                    disabled={code.length !== 5}
                    onClick={submit}
                >
                    <span>Join game</span>
                    <span className="icon">
                        <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                </button>
            </div>
            { error
                ? <div className="block notification is-danger">
                    Error: { error }
                </div>
                : <></>
            }
        </div>
    </div>
}