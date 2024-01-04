// Copyright © 2023 Navarrotech

// @ts-ignore
import useSound from 'use-sound';

import horse from './horse.mp3'
import quack from './quack.mp3'
import select from './select.mp3'
import join from './join.mp3'
import correct from './correct.mp3'

export const sounds = {
    horse,
    quack,
    select,
    join,
    correct
} as const

export function getCorrectSound(){
    return correct;
}

const incorrectSounds = [
    horse,
    quack
]
export function getIncorrectSound(){
    return incorrectSounds[
        Math.floor(Math.random() * incorrectSounds.length)
    ]
}

const paperSounds = [

]
export function getPaperSound(){
    return paperSounds[
        Math.floor(Math.random() * paperSounds.length)
    ]
}

export {
    useSound
}
