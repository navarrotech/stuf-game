// Copyright © 2023 Navarrotech

// Redux
import { useSelector } from "../redux-store"

// UI
import AddPlayer from "./AddPlayer"
import Lobby from './Lobby'
import Loader from "../common/Loader"
import ChooseCard from "./ChooseCard"
import RespondToQuestions from "./RespondToQuestions"
import RevealCards from "./RevealCards"
import Guessing from "./Guessing"
import { objectToBase64 } from "../common/utils"
import ShowRoundResults from "./ShowRoundResults"

export default function Game(){
    const game = useSelector(state => state.game)

    const {
        me,
        mySessionId,
        data: {
             started,
             ended,

             current_player,
             current_question,
             finished_submissions,
             finished_revealing,
             finished_guessing,
        }
    } = game

    console.log(game)

    if(!mySessionId){
        return <Loader />
    }

    if(ended){
        // TODO: Add game component
        return <></>
    }

    if(!me){
        return <AddPlayer />
    }

    if(!started){
        return <Lobby game={game} />
    }

    if(current_player && !current_question){
        return <ChooseCard game={game} />
    }

    if(current_question && !finished_submissions){
        return <RespondToQuestions game={game} />
    }

    if(finished_submissions && !finished_revealing){
        return <RevealCards game={game} />
    }

    if(!finished_guessing){
        return <Guessing game={game} />
    }

    if(finished_guessing){
        return <ShowRoundResults game={game} />
    }

    const bugInfo = objectToBase64(game)
    return <div className="container is-max-fullhd has-text-centered">
        <div className="block box" style={{ maxWidth: '850px', display: 'block', margin: 'auto' }}>
            <div className="block">
                <h1 className="title is-size-1">Unexpected bug occurred</h1>
                <h2 className="subtitle is-size-3">We're sorry, but something went wrong.</h2>
            </div>
            <div className="block">
                <p>If you see this screen, please report the bug to <a>hello@navarrotech.net</a> <br />and ensure you copy+paste the following debug information:</p>
                <pre>{ bugInfo }</pre>
            </div>
            <div className="block buttons is-centered">
                <button className="button is-primary" type="button">
                    <span>Main menu</span>
                </button>
                <button className="button is-primary" type="button" onClick={() => navigator.clipboard.writeText(bugInfo)}>
                    <span>Copy bug information</span>
                </button>
            </div>
        </div>
    </div>
}
