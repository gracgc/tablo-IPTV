import React, {useEffect, useState} from "react";

import {useHistory} from "react-router";


const Lag = (props) => {

    let history = useHistory();

    useEffect(() => {

        let time = Date.now()
        for (var i = 0; i < 10000; i++) {
            document.getElementById("a").innerHTML += Math.random()
        }
        window.localStorage.setItem('lag', Math.round((Date.now() - time) / 1000));
        history.push('/tabloClient');

    }, [])


    return (
        <div>
            <div id='a' style={{display: "none"}}>

            </div>
            КАЛИБРОВКА
        </div>

    )
}

export default Lag;