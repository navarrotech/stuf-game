// Copyright © 2023 Navarrotech
import { Link, useNavigate } from "react-router-dom"

// UI
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTheme } from "../themes"
import { logo } from "../common/sprites"

// Redux + API
import { createGame } from "../api"

export default function Welcome(){

    const navigate = useNavigate();

    useTheme("beige")

    async function newGame(){
        const { game } = await createGame()

        if(!game){
            return;
        }

        navigate('/game/' + game.id)
    }

    return <div className="container is-max-fullhd has-text-centered">
        <figure className="block image is-centered is-400x400">
            <img src={logo} alt="Stuf" />
        </figure>
        <h1 className="block carter-one is-size-1 is-themed">
            The party game full of fun,
            <br/>laughs, giggles, and shock!
        </h1>
        <div className="block buttons is-centered are-large">
            <button className="button is-success" type="button" onClick={newGame}>
                <span>Start New Game</span>
                <span className="icon">
                    <FontAwesomeIcon icon={faPlus} />
                </span>
            </button>
            <Link className="button is-link" to="/join">
                <span>Join Existing Game</span>
                <span className="icon">
                    <FontAwesomeIcon icon={faArrowRight} />
                </span>
            </Link>
        </div>
    </div>
}