// Copyright © 2023 Navarrotech
import { useEffect } from "react";
import { Outlet, Navigate, useParams, useNavigate } from "react-router";

// Core
import { io } from "socket.io-client";
import { VITE_APP_API } from "../env";
import { dispatch, useSelector } from "../redux-store";
import { resetGame, setGame } from "../redux-store/game";
import { Game } from "../types";
import { getGame } from "../api";

export default function Dashboard(){
    const sessionId = useSelector(state => state.game.mySessionId)
    const { game_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(!game_id){
            return;
        }
        getGame(game_id)
            .then(({ game, session_id }) => {
                if(!game){
                    dispatch( resetGame(true) )
                    return navigate("/welcome")
                }
                dispatch(
                    setGame({ game, sessionId: session_id })
                )
            })
    }, [ navigate, game_id ])

    useEffect(() => {
        if(!game_id || !sessionId){
            return;
        }
        const socket = io(VITE_APP_API, {
            transports: ["websocket"],
            query: {
                game_id,
                session_id: sessionId
            }
        })

        socket.on("connect", () => {
            console.log("Connected to socket server")
        })
        socket.on("disconnect", () => {
            console.log("Disconnected from socket server")
        })
        socket.on("errors", (data: any) => {
            if(data.code === "game_not_found"){
                // TODO: Show a toast here?
                dispatch( resetGame(true) )
                return navigate("/welcome")
            }
            console.log("errors", data)
        })
        socket.on("game", (game: Game) => {
            dispatch(
                setGame({ game })
            )
        })
        socket.on("events", (data: any) => {
            if(data.code === "game_closed"){
                // TODO: Should probably go to a "thanks for playing" page here
                dispatch( resetGame(true) )
                return navigate("/welcome")
            }
            console.log("events", data)
        })

        return () => {
            socket.close()
        }
    }, [ navigate, game_id, sessionId ])

    if(!game_id){
         return <Navigate to="/" />
    }

    return <Outlet />
}
