import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {devicesAPI} from "../../../api/api";
import {useSelector} from "react-redux";
import socket from "../../../socket/socket";


const LagClient = (props) => {


    let player = window.TvipPlayer;

    let stb = window.stb;


    let history = useHistory();

    useEffect(() => {


        if (stb) {
            stb.pause()
        }

        if (player) {
            player.pause();
        }

        let time = Date.now()
        for (var i = 0; i < 10000; i++) {
            document.getElementById("a").innerHTML += Math.random()
        }

        devicesAPI.putDeviceLag(socket.id, Math.round((Date.now() - time) / 1000)).then(r => {
            if (r.resultCode === 0) {
                history.push('/tabloClient');
                if (stb) {
                    stb.continuePlay()
                }

                if (player) {
                    player.unpause();
                }
            }
        })

    }, [])


    return (
        <div>
            <div id='a' style={{display: "none"}}>

            </div>
            <div style={{width: '100%', height: '100%', backgroundColor: 'black', color: 'green'}}>
                КАЛИБРОВКА
            </div>
        </div>

    )
}

export default LagClient;