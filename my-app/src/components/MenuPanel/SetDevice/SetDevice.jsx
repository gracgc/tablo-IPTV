import React, {useEffect, useState} from "react";
import c from './SetDevice.module.css'
import c1920 from './SetDevice_1920.module.css'
import socket from "../../../socket/socket";
import * as axios from "axios";
import Device from "./Device";
import {NavLink} from "react-router-dom";



const SetDevice = (props) => {

    let width = window.innerWidth;

    let [devices, setDevices] = useState([{id: 0, type: 'type'}])

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
        socket.on('getDevices', devices => {
            setDevices(devices)
        })
    }, []);


    return (
        <div className={width === 1920 ? c1920.setDevice : c.setDevice}>
            <span className={width === 1920 ? c1920.menuTitle : c.menuTitle}>Настройка устройств</span>
            <div className={width === 1920 ? c1920.navbar : c.navbar}>
                {devices.map(d => <Device id={d.id} type={d.type} lag={d.lag}/>)}
            </div>
            <NavLink to="/">
                <div className={width === 1920 ? c1920.navBackButton : c.navBackButton}>
                    Вернуться в меню
                </div>
            </NavLink>

        </div>
    )
};

export default SetDevice;

