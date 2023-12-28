// Copyright © 2023 Navarrotech

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

type Props<T = any> = {
    items: T[];
    keyof: keyof T;
    selected: string;
    setSelected: (value: string) => void;
    element: (item: T) => JSX.Element;
};

export default function Carousel({ items, keyof, selected, element, setSelected }: Props){
    const index = items.findIndex(item => item[keyof] === selected)

    function setIndex(newIdx: number){
        setSelected(
            items[newIdx]?.[keyof]
        )
    }

    function handlePrevClick(){
        if (index > 0) {
            return setIndex(index - 1);
        }
        setIndex(items.length - 1);
    }

    function handleNextClick(){
        if (index < items.length - 1) {
            return setIndex(index + 1);
        }
        setIndex(0);
    }

    if(items.length === 0){
        return <></>
    }

    if(items.length === 1){
        return <div className="level-item">
            { element(items[0]) }
        </div>
    }

    return <div className="level-item">
        <button className="button is-white mx-4" type="button" onClick={handlePrevClick}>
            <span className="icon">
                <FontAwesomeIcon icon={faCaretLeft} />
            </span>
        </button>
        { element(items[index]) }
        <button className="button is-white mx-4" type="button" onClick={handleNextClick}>
            <span className="icon">
                <FontAwesomeIcon icon={faCaretRight} />
            </span>
        </button>
    </div>
}
  