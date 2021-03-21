import React, {useEffect, useState} from 'react'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import useInterval from "use-interval";
import {setDifAC, setPingAC} from "../../redux/dif_reducer";
import {tabloAPI} from "../../api/api";
import Cookies from "js-cookie";

const Dif = (props) => {


    let tupit = +Cookies.get('tupit') - 10

    // let tupit = 0

    const dif = useSelector(
        (state => state.difPage.dif)
    );

    const ping = useSelector(
        (state => state.difPage.ping)
    );

    let dispatch = useDispatch();

    useInterval(() => {
        tabloAPI.getTimerSync(Date.now()).then(r => {

            let serverPing = Math.round((Date.now() - r.dateClient) / 2);
            let timeSyncServer = r.dateServer - r.dateClient

            if (serverPing < ping) {
                if (window.TvipPlayer) {
                    dispatch(setDifAC(timeSyncServer + serverPing - tupit))
                } else {
                    dispatch(setDifAC(timeSyncServer + serverPing + tupit))
                }

                dispatch(setPingAC(serverPing))
            }

        })
    }, 1000);


    return (

        <div style={{
            textAlign: 'center',
            position: 'absolute',
            right: '30px',
            color: 'green'
        }}>
            Dif:{dif} Ping:{ping}
            Tupit:{tupit}</div>
    )
};

export default compose(withRouter)(Dif);
