import { createSlice } from "@reduxjs/toolkit"

import type { PayloadAction } from "@reduxjs/toolkit"
import type { Game, Player } from "../types"
import type { CreateAction } from "."


export type State = {
  me?: Player,
  mySessionId?: string,
  data: Game
}

export type StartupPayload = {
  game: Game,
  sessionId?: string,
}

const initialState: State = {
  me: undefined,
  mySessionId: undefined,

  data: {
    id: null,
    questions_asked: {},
    host_id: null,
    players: [],
  
    started: false,
    ended: false,
  
    round_title: 'Just Getting Started...',
    current_player: null,
    current_question: null,
    current_question_time_expiration: null,
    current_submissions: {},
    current_guess: {},
    finished_submissions: false,
    finished_revealing: false,
    finished_guessing: false,

    shuffle_seed: 0,
  
    settings: {
        allow_nsfw: false,
        password: null,
        max_rounds: null,
        max_players: null,
        time_per_round: null,
    },
  
    round: 0,
    time_started: 0,
    time_last_updated: 0,
  }
}

export const constants = {
  SET_GAME: 'GAME/SET',
  RESET: 'GAME/DEL'
}

const slice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    [constants.SET_GAME]: (state, action: PayloadAction<StartupPayload>) => {
      const game = action.payload.game;
      const id = action.payload.sessionId || state.mySessionId;

      if(!game){
        return console.log("No game found in payload", action.payload);
      }

      state = {
        data: {
          ...state.data,
          ...game,
        },
        mySessionId: id,
        me: game?.players.find(player => player?.id === id),
      }
      return state;
    },
    [constants.RESET]: (state, action: PayloadAction<boolean>) => {
      if(action.payload){
        state = initialState;
      }
      return state;
    }
  }
})

export default slice;

export const setGame = slice.actions[constants.SET_GAME] as CreateAction<StartupPayload>
export const resetGame = slice.actions[constants.RESET] as CreateAction<boolean>
