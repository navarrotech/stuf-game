// Copyright © 2023 Navarrotech

const {
    NODE_ENV="development",
    VITE_APP_API=window.location.origin,
// @ts-ignore
} = import.meta.env

export {
    NODE_ENV,
    VITE_APP_API,
}