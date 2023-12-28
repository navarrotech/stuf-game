// Copyright © 2023 Navarrotech
import { useState, useEffect } from "react"

import type { Game } from "../types"

export const questionsSFW = [
    "Stuff you don't expect to hear from a police officer.",
    "Stuff you don't expect to hear from a doctor.",
    "Stuff you wouldn't want to clean.",
    "Stuff that would make work more exciting.",
    "Stuff that would make school more exciting.",
    "Stuff that would make celebrities more interesting.",
    "Stuff that would make Gucci or Louis Vuitton worth it.",
    "Stuff you wouldn't want to find in your bed.",
    "Stuff you wouldn't want to find in your food.",
    "Stuff you should't pick up.",
    "Stuff you shouldn't put in your mouth.",
    "Stuff you could use as an excuse on your judgement day.",
    "Stuff you shouldn't do in a public bathroom.",
    "Stuff you wouldn't want to find in your Christmas stocking.",
    "Stuff you would want to find in your Christmas stocking.",
    "Stuff you wouldn't want Santa to bring you.",
    "Stuff you shouldn't let an amateur do.",
    "Stuff you shouldn't let a professional do.",
    "Stuff that seems to take an eternity.",
    "Stuff you would like to play with.",
    "Stuff you would wish for if you found a genie in a bottle.",
    "Stuff children shouldn't play with.",
    "Stuff you shouldn't do on your desk.",
    "Stuff you shouldn't do on your bed.",
    "Stuff about men that frustrates you.",
    "Stuff about women that frustrates you.",
    "Stuff you would like to do on a vacation.",
    "Stuff that makes you scream.",
    "Stuff that would get you fired.",
    "Stuff that would prevent you from getting fired.",
    "Stuff you shouldn't do while having dinner with the president.",
    "Stuff you don't expect to hear from an uncle.",
    "Stuff you hope never comes back into fashion.",
    "Stuff you can't believe survived.",
    "Stuff that would make you a bad parent.",
    "Stuff that harms the gene pool.",
    "Stuff that would make you a bad teacher.",
    "Stuff you wouldn't want to find while cleaning the house.",
    "Stuff you shouldn't say to your mother.",
    "Stuff you shouldn't say to your father.",
    "Stuff you shouldn't say to get out of a speeding ticket.",
    "Stuff you should keep hidden.",
    "Stuff that you think other people keep as their #1 secret.",
    "Stuff that the chicken crossed the road for.",
    "Stuff you shouldn't do while drunk.",
    "Stuff you shouldn't do while high.",
    "Stuff you shouldn't do while on a date.",
    "Stuff you shouldn't do while on a job interview.",
    "Stuff you shouldn't do while on a roller coaster.",
    "Stuff you shouldn't do while on a plane.",
    "Stuff you love to talk about.",
    "Stuff you hate to talk about.",
    "Stuff you shouldn't say to your dentist.",
    "Stuff you never see as a newspaper headline.",
    "Stuff you shouldn't teach your parrot to say.",
    "Stuff that hurt.",
    "Stuff you do differently from your parents.",
    "Stuff you do just like your parents.",
    "Stuff that is useless.",
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
