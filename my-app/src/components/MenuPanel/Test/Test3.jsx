import React, {useEffect, useState} from "react";
import c from './Video.module.css'
import c1920 from './Video_1920.module.css'
import useInterval from "use-interval";
import socket from "../../../socket/socket";
import {tabloAPI} from "../../../api/api";


const Test3 = (props) => {

    let [a, setA] = useState(1)

    let random = () => {
        setA(Math.random())
    }


    return (
        <div style={{fontSize: 100}}>
            {a} <br/>
            <div onClick={e => random()} style={{border: '1px white solid'}}>random</div>
        </div>
    )
}

export default Test3;