// Copyright © 2023 Navarrotech

import type { State } from "../redux-store/game"

// UI
import BannerMenu from "../common/BannerMenu"
import { useTheme } from "../themes"
import { PlayerList } from "../common/PlayerToken"
import { pluralize } from "../common/utils"
import JoinBanner from "../common/JoinBanner"
import ShareButton from "../common/ShareButton"

// API
import { markReady } from '../api'

type Props = {
    game: State
}

export default function Lobby({ game }: Props){

    const isReady = game.me?.ready

    useTheme()

    return <BannerMenu bannerLeft="Waiting for players to join..." bannerRight={<ShareButton />}>
        <div className="level is-fullwidth">
            <div className="level-left">
                <h1 className="title has-text-centered has-text-white">
                    <span className="is-size-1">{ game.data.players.length }</span>
                    <br />
                    <span className="is-size-5">{ pluralize(game.data.players.length, "Players") }</span>
                </h1>
            </div>
            <div className="level-item">
                <JoinBanner game={game.data} />
            </div>
            <div
                className="level-right has-tooltip-left"
                data-tooltip={game.data.players.length === 1
                    ? "You need at least 2 players to start the game"
                    : undefined
                }
            >
                <button
                    className="button is-success is-large"
                    disabled={game.data.players.length === 1 || isReady}
                    type="button"
                    onClick={() => {
                        if(!isReady){
                            markReady();
                        }
                    }}
                >
                    <span>Ready!</span>
                </button>
            </div>
        </div>
        <PlayerList players={game.data.players} />
    </BannerMenu>
}