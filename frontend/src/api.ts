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

type CreateResponse = {
    game?: Game,
    host_id?: string
}

export async function createGame(): Promise<CreateResponse> {
    const response = await axios.post<CreateResponse>("/v1/create")

    if(response.status !== 200){
        console.error(response)
    }

    const { game, host_id } = response.data

    if(game && host_id){
        dispatch(
            setGame({
                game,
                sessionId: host_id
            })
        )
    }

    return response.data as CreateResponse
}

type StandardResponse = {
    game?: Game,
    session_id?: string,
    error?: string,
}

export async function joinGame(name: string, image: string): Promise<StandardResponse> {
    const state = getState()
    const game_id = state.game.data.id

    if(!game_id){
        console.error(state, "No local game id found")
    }

    const response = await axios.post<StandardResponse>("/v1/join", {
        game_id,
        name,
        image
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

export async function getGame(game_id: string): Promise<StandardResponse> {
    const response = await axios.post<StandardResponse>(`/v1/get`, { game_id })

    if(response.status !== 200){
        console.error(response)
    }

    return response.data
}

export async function markReady(): Promise<StandardResponse> {
    const state = getState()
    const game_id = state.game.data.id
    const response = await axios.post<StandardResponse>(`/v1/ready`, { game_id })

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

export async function chooseQuestion(question: string){
    const state = getState()
    const game_id = state.game.data.id
    const response = await axios.post<StandardResponse>(`/v1/choose-question`, { game_id, question })

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
