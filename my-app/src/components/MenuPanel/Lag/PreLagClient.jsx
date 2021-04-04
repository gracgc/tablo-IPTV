import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {devicesAPI} from "../../../api/api";
import {useSelector} from "react-redux";
import socket from "../../../socket/socket";


const PreLagClient = (props) => {


    let history = useHistory();


    setTimeout(() => {
        history.push('/lagClient');
    }, 1000)


    return (
        <div>
            <div style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'black',
                margin: 'auto 0',
                color: 'green',
                fontSize: 50
            }}>
                КАЛИБРОВКА
            </div>
        </div>
    )
}

export default PreLagClient;