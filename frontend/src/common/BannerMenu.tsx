// Copyright © 2023 Navarrotech
import type { ReactNode } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHourglassStart } from "@fortawesome/free-solid-svg-icons";

type Props = {
    title?: string,
    bannerLeft: string,
    bannerLeftIcon?: IconDefinition,
    bannerRight?: ReactNode,
    children: ReactNode,
}

export default function BannerMenu(props: Props){
    const {
        bannerLeft,
        bannerLeftIcon = faHourglassStart,
        bannerRight,
        title,
        children
    } = props;

    return <div className="banner-container">
        {
            title && <h1 className="title has-text-centered is-size-1 carter-one">{ title }</h1>
        }
        <div className="banner-content">
            { children }
        </div>
        <div className="level banner">
            <div className="level-left">
                <div className="level-item">
                    <div className="banner-left">
                        { bannerLeftIcon && <FontAwesomeIcon size="2xl" icon={ bannerLeftIcon } /> }
                        { bannerLeft }
                    </div>
                </div>
            </div>
            { bannerRight && <div className="level-right">
                <div className="level-item">
                    { bannerRight }
                </div>
            </div> }
        </div>
    </div>
}