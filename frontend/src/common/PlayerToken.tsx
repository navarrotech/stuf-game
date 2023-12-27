// Copyright © 2023 Navarrotech

import type { Player } from "../types";

import { getSpriteUrl } from "./sprites";

type Props = {
    player: Player,
    highlight?: boolean,
    subtitle?: string
}
export default function PlayerToken({ player, highlight, subtitle }: Props){
    const isDisconnected = player.status === "disconnected"
    return <div className={
        "level-left player-token" 
        + (isDisconnected ? " is-disconnected" : "") 
        + (highlight ? " is-highlighted" : "") // TODO: Highlight
    }>
        <div className="level-item">
            <figure className="image">
                <img src={getSpriteUrl(player.image)} alt={player.name} />
            </figure>
        </div>
        <div>
            <p className={"title" + (!subtitle ? " mb-0" : "")}>{ player.name }</p>
            {
                isDisconnected
                    ? <p className="subtitle">Disconnected</p>
                    : subtitle
                        ? <p className="subtitle">{ subtitle }</p>
                        : <></>
            }
        </div>
    </div>
}

type PlayerListProps = {
    players: Player[],
    highlight?: string,
    subtitle?: (player: Player) => string,
}
export function PlayerList({ players, highlight, subtitle }: PlayerListProps){
    return <div className="player-list">
        { players.map(player => {
            return <PlayerToken
                key={player.id}
                player={player}
                highlight={highlight === player.id}
                subtitle={subtitle?.(player)}
            />
        }) }
    </div>
}