// Copyright © 2023 Navarrotech
import { useEffect } from "react";

// Not including beige as it's the menu theme,
// And is not meant to be randomly used throughout the game.
const availableThemes = [
    "pink",
    "blue",
    "purple",
    "orange",
    "green",
    "red",
    "cyan"
] as const;

type Theme = typeof availableThemes[number] | "beige";
const htmlElement = document.querySelector("html") as HTMLElement;

const themeMap = [
    ...availableThemes.map(theme => "is-" + theme),
    "is-beige",
];
export function setTheme(value: Theme){
    htmlElement.classList.remove(...themeMap);
    htmlElement.classList.add("is-" + value);
}

export function randomTheme(): Theme {
    const index = Math.floor(
        Math.random() * availableThemes.length
    );
    return availableThemes[index];
}

export function useTheme(theme?: Theme){
    useEffect(() => {
        setTheme(theme || randomTheme());
    }, [ theme ]);
}
