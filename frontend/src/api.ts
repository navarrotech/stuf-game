// Copyright © 2023 Navarrotech

// Types
import type { Game } from "./types"

// Redux
import { dispatch, getState } from "./redux-store"
import { setGame } from "./redux-store/game"

// Utility
import axios from "axios"
import { VITE_APP_API } from './env';

// Axios defaults
axios.defaults.baseURL = VITE_APP_API
axios.defaults.withCredentials = true
axios.defaults.responseType = "json"
axios.defaults.validateStatus = () => true

type StandardResponse = {
    game?: Game,
    session_id?: string,
    error?: string,
}
async function standardRequest(url: string, additionalParams: any): Promise<StandardResponse>{
    const state = getState()
    const game_id = additionalParams?.game_id || state.game?.data?.id

    if(!game_id){
        console.error(state, "No game id found to use while fetching ", url, additionalParams)
    }

    const response = await axios.post<StandardResponse>(url, {
        game_id,
        ...additionalParams
    })

    if(response.status !== 200){
        console.error(response)
    }

    const { game, session_id } = response.data

    if(game && session_id){
        dispatch(
            setGame({
                game,
                sessionId: session_id
            })
        )
    }

    return response.data
}

export const createGame       = async ()                               => standardRequest("/v1/create",           { })
export const joinGame         = async (name: string, image: string)    => standardRequest("/v1/join",             { name, image })
export const getGame          = async (game_id: string)                => standardRequest("/v1/get",              { game_id })
export const markReady        = async ()                               => standardRequest("/v1/ready",            { })
export const chooseQuestion   = async (question: string)               => standardRequest("/v1/choose-question",  { question })
export const createSubmission = async (submission: string)             => standardRequest("/v1/submit-response",  { submission })
export const revealCard       = async (player_id: string)              => standardRequest("/v1/reveal-card",      { player_id })
export const finishRevealing  = async ()                               => standardRequest("/v1/finish-revealing", { })
export const submitGuess      = async (guess: string, correct: string) => standardRequest("/v1/guess",            { guessed_player_id: guess, correct_player_id: correct })
export const endTurn          = async ()                               => standardRequest("/v1/end-turn",         {})
