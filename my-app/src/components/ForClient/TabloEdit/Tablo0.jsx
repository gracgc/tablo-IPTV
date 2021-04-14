import React, {useEffect} from 'react'
import c from './TabloClient1.module.css'
import socket from "../../../socket/socket";
import {compose} from "redux";
import {withRouter} from "react-router";


const Tablo0 = (props) => {

    useEffect(() => {
        socket.emit(`setGameNumberStart_${socket.io.engine.hostname}`, 'res');
        socket.on(`getGameNumberStart_${socket.io.engine.hostname}`, gameNumber => {
            props.history.push('/tabloClient/' + gameNumber);
            // window.location.reload()
        })
    }, []);

    return (
        <div className={c.tablo}>
            <div className={c.tablo0}>TABLO</div>
        </div>
    )
};

export default compose(withRouter)(Tablo0);
