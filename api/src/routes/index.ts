 // Copyright © 2023 Navarrotech
 
// Types
import type { Route } from '../types'

// Routes
import newGame  from './new-game'
import getGame  from './get-game'
import joinGame from './join-game'
import endGame  from './end-game'

import ready from './ready'
import chooseQuestion from './choose-question'
import submitResponse from './submit-response'
import revealCard from './reveal-card'
import finishRevealing from './finish-revealing'
import submitGuess from './submit-guess'

export const routes: Route[] = [
    newGame,
    getGame,
    joinGame,
    endGame,

    ready,
    chooseQuestion,
    submitResponse,
    revealCard,
    finishRevealing,
    submitGuess,
]
