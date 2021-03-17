import React, {useEffect, useState} from "react";
import c from './Video.module.css'
import c1920 from './Video_1920.module.css'
import useInterval from "use-interval";
import socket from "../../../socket/socket";
import {tabloAPI} from "../../../api/api";


const Test3 = (props) => {

    let [start, setStart] = useState()

    let [finish, setFinish] = useState()


    // for (let i = 0; i < 10000; i++) {
    //     setStart(1);
    // }

    // setFinish(new Date().getTime() - start);




    return (
        <div style={{fontSize: 50}}>
            <div>
                {start}
            </div>
            <br/>
            <div>
                {finish}
            </div>
        </div>
    )
}

export default Test3;