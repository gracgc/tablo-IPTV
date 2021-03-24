import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {GithubPicker} from 'react-color'

const Test2 = (props) => {

    let [color, setColor] = useState('#ffffff')

    let [isShowColors, setIsShowColors] = useState(false)

    let changeColor = (color) => {
        setColor(color)
        setIsShowColors(false)
    }


    return (
        <div>
            {isShowColors
                ? <GithubPicker
                    color={color}
                    onChange={color => changeColor(color.hex)}/>
                : <div onClick={e => setIsShowColors(true)}>
                    {color}
                </div>
            }
        </div>
    )
}

export default Test2;