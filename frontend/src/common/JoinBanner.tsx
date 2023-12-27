// Copyright © 2023 Navarrotech

import type { Game } from "../types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";

type Props = {
    game: Game
}

export default function JoinBanner({ game }: Props){
    return <div className="level pl-6">
        <div className="box mb-0">
            <p className="is-size-3">Join at <strong>{ window.location.host }</strong></p>
            <p>
                <span className="is-size-5 mr-2">With Game Code:</span>
                <span className="is-size-1">
                    <strong>{ game.id }</strong>
                </span>
            </p>
        </div>
        <div className="mx-4">
            <FontAwesomeIcon icon={faAnglesRight} size="3x" />
        </div>
        <div className="box mb-0">
            <figure className="image" style={{ maxWidth: "230px" }}>
                <img src="/join-game.png" alt="Join Game" />
            </figure>
        </div>
    </div>
}