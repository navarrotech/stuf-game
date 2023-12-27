// Copyright © 2023 Navarrotech
import { useState, useEffect } from "react"

import type { Game } from "../types"

export const questionsSFW = [
    "STUF you don't expect to hear from a police officer.",
    "STUF you don't expect to hear from a doctor.",
    "STUF you wouldn't want to clean.",
    "STUF that would make work more exciting.",
    "STUF that would make school more exciting.",
    "STUF that would make celebrities more interesting.",
    "STUF that would make Gucci or Louis Vuitton worth it.",
    "STUF you wouldn't want to find in your bed.",
    "STUF you wouldn't want to find in your food.",
    "STUF you should't pick up.",
    "STUF you shouldn't put in your mouth.",
    "STUF you could use as an excuse on your judgement day.",
    "STUF you shouldn't do in a public bathroom.",
    "STUF you wouldn't want to find in your Christmas stocking.",
    "STUF you would want to find in your Christmas stocking.",
    "STUF you wouldn't want Santa to bring you.",
    "STUF you shouldn't let an amateur do.",
    "STUF you shouldn't let a professional do.",
    "STUF that seems to take an eternity.",
    "STUF you would like to play with.",
    "STUF you would wish for if you found a genie in a bottle.",
    "STUF children shouldn't play with.",
    "STUF you shouldn't do on your desk.",
    "STUF you shouldn't do on your bed.",
    "STUF about men that frustrates you.",
    "STUF about women that frustrates you.",
    "STUF you would like to do on a vacation.",
    "STUF that makes you scream.",
    "STUF that would get you fired.",
    "STUF that would prevent you from getting fired.",
    "STUF you shouldn't do while having dinner with the president.",
    "STUF you don't expect to hear from an uncle.",
    "STUF you hope never comes back into fashion.",
    "STUF you can't believe survived.",
    "STUF that would make you a bad parent.",
    "STUF that harms the gene pool.",
    "STUF that would make you a bad teacher.",
    "STUF you wouldn't want to find while cleaning the house.",
    "STUF you shouldn't say to your mother.",
    "STUF you shouldn't say to your father.",
    "STUF you shouldn't say to get out of a speeding ticket.",
    "STUF you should keep hidden.",
    "STUF that you think other people keep as their #1 secret.",
    "STUF that the chicken crossed the road for.",
    "STUF you shouldn't do while drunk.",
    "STUF you shouldn't do while high.",
    "STUF you shouldn't do while on a date.",
    "STUF you shouldn't do while on a job interview.",
    "STUF you shouldn't do while on a roller coaster.",
    "STUF you shouldn't do while on a plane.",
    "STUF you love to talk about.",
    "STUF you hate to talk about.",
    "STUF you shouldn't say to your dentist.",
    "STUF you never see as a newspaper headline.",
    "STUF you shouldn't teach your parrot to say.",
    "STUF that hurt.",
    "STUF you do differently from your parents.",
    "STUF you do just like your parents.",
    "STUF that is useless.",
]

const questionsNSFW: string[] = []

export const allQuestions = questionsSFW.concat(questionsNSFW)

export function get3RandomUniqueQuestions(game: Game): string[] {
    const questions: string[] = []
    const questionBank = game.settings.allow_nsfw ? allQuestions : questionsSFW

    while (questions.length < 3) {
        
        const randomQuestion = questionBank[
            Math.floor(Math.random() * questionBank.length)
        ]

        if (!questions.includes(randomQuestion) && !game.questions_asked[randomQuestion]) {
            questions.push(randomQuestion)
        }

    }

    return questions
}

export function useQuestions(game: Game){
    const [ questions, setQuestions ] = useState<string[]>([])

    useEffect(() => {
        setQuestions(
            get3RandomUniqueQuestions(game)
        )
    // eslint-disable-next-line
    }, [ game.id, game.current_player ])

    return questions
}
