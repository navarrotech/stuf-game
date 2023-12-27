// Copyright © 2023 Navarrotech
import { useState, useEffect } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faShareNodes } from "@fortawesome/free-solid-svg-icons"

export default function ShareButton(){
    const [ copied, setCopied ] = useState(false)

    useEffect(() => {
        if(!copied){
            return
        }

        const timeout = setTimeout(() => {
            setCopied(false)
        }, 2_000)

        return () => {
            clearTimeout(timeout)
            if(copied){
                setCopied(false)
            }
        }
    }, [ copied ])

    return <button
        className={"button is-large is-" + (copied ? "white" : "themed")}
        style={{ minWidth: "245px" }}
        type="button"
        onClick={async () => {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true)
            } catch (err: any) {
                console.error('Failed to copy: ', err);
            }
        }}
    >
        <span>{
            copied
                ? "Link Copied!"
                : "Invite Friends"
        }</span>
        <span className="icon">
            <FontAwesomeIcon
                icon={copied ? faCheck : faShareNodes}
            />
        </span>
    </button>
}