import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {GithubPicker} from 'react-color'
import c1920 from "../MenuPanel/CreateGame/CreateGame_1920.module.css";
import c from "../MenuPanel/CreateGame/CreateGame.module.css";

const PickColor = (props) => {

    let width = window.innerWidth;


    let [isShowColors, setIsShowColors] = useState(false)

    let changeColor = (color) => {
        props.setColor(color)
        setIsShowColors(false)
    }


    return (
        <div>
            {isShowColors
                ? <div style={{position: 'absolute', zIndex: 1000, left: width === 1920 ? 280 : 120}}>
                    <GithubPicker
                        color={props.color}
                        onChange={color => changeColor(color.hex)}/>
                </div>
                : <div onClick={e => setIsShowColors(true)} style={{width: '100%', height: 36, backgroundColor: props.color}}>

                </div>
            }
        </div>
    )
}

export default PickColor;