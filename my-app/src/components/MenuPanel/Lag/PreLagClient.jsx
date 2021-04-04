import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {devicesAPI} from "../../../api/api";
import {useSelector} from "react-redux";
import socket from "../../../socket/socket";


const PreLagClient = (props) => {


    let history = useHistory();


    useEffect(() => {

        history.push('/lag');

    }, [])


    return (
        <div>
            <div style={{width: '100vw', height: '100vh', backgroundColor: 'black'}}>
                <div style={{margin: 'auto', color: 'green', fontSize: 50}}>
                    КАЛИБРОВКА
                </div>
            </div>
        </div>
    )
}

export default PreLagClient;