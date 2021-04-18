import React, {useEffect, useState} from 'react'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import useInterval from "use-interval";
import {setDifAC, setPingAC} from "../../redux/dif_reducer";
import {tabloAPI} from "../../api/api";
import socket from "../../socket/socket";


const Dif = (props) => {

    let lag = +window.localStorage.getItem('lag')

    let [tupit, setTupit] = useState(lag)

    const stadium = window.localStorage.getItem('stadium')

    useEffect(() => {
        socket.on(`setDeviceLag${socket.id}`, lag => {
            setTupit(lag)
        })
    }, [])



    const dif = useSelector(
        (state => state.difPage.dif)
    );

    const ping = useSelector(
        (state => state.difPage.ping)
    );

    let dispatch = useDispatch();


    useInterval(() => {
        if (ping > 20) {
            tabloAPI.getTimerSync(Date.now()).then(r => {

                let serverPing = Math.round((Date.now() - r.dateClient) / 2);
                let timeSyncServer = r.dateServer - r.dateClient

                if (serverPing < ping) {


                    dispatch(setDifAC(timeSyncServer + serverPing + tupit))


                    dispatch(setPingAC(serverPing))
                }

            })
        }
    }, 1000);


    return (

        <div style={{
            textAlign: 'center',
            position: 'absolute',
            right: '30px',
            color: 'green'
        }}>
            Dif:{dif} Ping:{ping} Tupit:{tupit}</div>
    )
};

export default compose(withRouter)(Dif);
