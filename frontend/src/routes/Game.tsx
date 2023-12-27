// Copyright © 2023 Navarrotech

// Redux
import { useSelector } from "../redux-store"

// UI
import AddPlayer from "./AddPlayer"
import Lobby from './Lobby'
import Loader from "../common/Loader"

export default function Game(){
    const game = useSelector(state => state.game)

    const {
        me,
        mySessionId,
        data: {
             started,
             ended,
        }
    } = game

    console.log(game)

    if(!mySessionId){
        return <Loader />
    }

    if(!me){
        return <AddPlayer />
    }

    if(!ended){
        // TODO: Add game component
        return <></>
    }

    if(!started){
        return <Lobby game={game} />
    }

    return <div className="container is-max-fullhd has-text-centered">
        <h1>Game</h1>
    </div>
}
