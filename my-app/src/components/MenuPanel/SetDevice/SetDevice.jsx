import React, {useEffect, useState} from "react";
import c from './SetDevice.module.css'
import c1920 from './SetDevice_1920.module.css'
import socket from "../../../socket/socket";
import * as axios from "axios";
import Device from "./Device";
import {NavLink} from "react-router-dom";
import logo from "../../ForAdmin/AdminPanel/Info/logoIPTVPORTAL.png";
import {useSelector} from "react-redux";



const SetDevice = (props) => {

    let width = window.innerWidth;

    let [devices, setDevices] = useState([{id: 0, type: 'type', lag: 0, isLockLag: false}])

    const stadium = window.localStorage.getItem('stadium')

    const getDevices = () => {
        return axios.get(`/api/devices`)
            .then(responce => {
                return responce.data
            });
    };

    useEffect(() => {
        getDevices().then(r => {
            setDevices(r)
        })
        socket.on(`getDevices`, devices => {
            setDevices(devices)
        })
    }, []);


    return (
        <div className={width === 1920 ? c1920.setDevice : c.setDevice}>
            <div className={width === 1920 ? c1920.menuHeader : c.menuHeader}>
                <div className={width === 1920 ? c1920.back : c.back}>
                    <img src={logo} alt="" width={width === 1920 ? 70 : 50} height={width === 1920 ? 70 : 50}/>
                    <NavLink to="/">
                        <div className={width === 1920 ? c1920.backButton : c.backButton}>
                            ВЕРНУТЬСЯ В МЕНЮ
                        </div>
                    </NavLink>
                </div>
                <div className={width === 1920 ? c1920.menuTitle : c.menuTitle}>УСТРОЙСТВА</div>
                <div></div>
            </div>
            <div className={width === 1920 ? c1920.navbar : c.navbar}>
                {devices.map(d => <Device id={d.id} type={d.type} lag={d.lag} isLockLag={d.isLockLag}/>)}
            </div>
        </div>
    )
};

export default SetDevice;

