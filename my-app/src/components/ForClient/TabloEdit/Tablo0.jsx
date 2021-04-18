import React, {useEffect} from 'react'
import c from './TabloClient1.module.css'
import socket from "../../../socket/socket";
import {compose} from "redux";
import {withRouter} from "react-router";
import {useSelector} from "react-redux";


const Tablo0 = (props) => {

    const stadium = window.localStorage.getItem('stadium')

    useEffect(() => {
        socket.emit(`setGameNumberStart`, 'res');
        socket.on(`getGameNumberStart`, gameNumber => {
            props.history.push('/tabloClient/' + gameNumber);
        })
        socket.on(`getGameNumber`, gameNumber => {
                props.history.push(`/tabloClient/${gameNumber}`);
            }
        );
    }, []);

    return (
        <div className={c.tablo}>
            <div className={c.tablo0}>TABLO</div>
        </div>
    )
};

export default compose(withRouter)(Tablo0);
