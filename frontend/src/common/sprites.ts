// Copyright © 2023 Navarrotech

import logoImg from "../images/logo.png";

// Images
const sprite0 = "/sprites/0.png";
const sprite1 = "/sprites/1.png";
const sprite2 = "/sprites/2.png";
const sprite3 = "/sprites/3.png";
const sprite4 = "/sprites/4.png";
const sprite5 = "/sprites/5.png";
const sprite6 = "/sprites/6.png";
const sprite7 = "/sprites/7.png";
const sprite8 = "/sprites/8.png";
const sprite9 = "/sprites/9.png";
const sprite10 = "/sprites/10.png";
const sprite11 = "/sprites/11.png";
const sprite12 = "/sprites/12.png";
const sprite13 = "/sprites/13.png";
const sprite14 = "/sprites/14.png";
const sprite15 = "/sprites/15.png";
const sprite16 = "/sprites/16.png";
const sprite17 = "/sprites/17.png";
const sprite18 = "/sprites/18.png";
const sprite19 = "/sprites/19.png";

export const spriteMap: Record<string, string> = {
    "0": sprite0,
    "1": sprite1,
    "2": sprite2,
    "3": sprite3,
    "4": sprite4,
    "5": sprite5,
    "6": sprite6,
    "7": sprite7,
    "8": sprite8,
    "9": sprite9,
    "10": sprite10,
    "11": sprite11,
    "12": sprite12,
    "13": sprite13,
    "14": sprite14,
    "15": sprite15,
    "16": sprite16,
    "17": sprite17,
    "18": sprite18,
    "19": sprite19,
} as const;

export const sprites: string[] = Object.values(spriteMap);

export function getRandomSprite(){
    return String(
        Math.floor(Math.random() * sprites.length)
    )
}

export function getSpriteUrl(path: string): string {
    return window.location.origin + path;
}

export const logo: string = logoImg;
