 // Copyright © 2023 Navarrotech
 
// Types
import type { Route } from '../types'

// Routes
import newGame  from './new-game'
import getGame  from './get-game'
import joinGame from './join-game'
import endGame  from './end-game'

import ready    from './ready'

export const routes: Route[] = [
    newGame,
    getGame,
    joinGame,
    endGame,

    ready,
]
