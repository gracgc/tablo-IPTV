import React, {useEffect, useState} from "react";
import c from './SetDevice.module.css';
import c1920 from './SetDevice_1920.module.css';
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {devicesAPI} from "../../../api/api";
import socket from "../../../socket/socket";
import {useSelector} from "react-redux";


const Device = (props) => {

    let width = window.innerWidth;

    const [showDeviceMenu, setShowDeviceMenu] = useState(false);

    const [lag, setLag] = useState(0);

    const stadium = window.localStorage.getItem('stadium')


    useEffect(() => {
        socket.on(`isLockLag${props.id}_${stadium}`)
    }, [])

    let devicesMenu = [
        'Main Tablo',
        'Video'
    ]


    const plusLag = () => {
        setLag(lag + 10)
    }

    const minusLag = () => {
        if (lag !== 0) {
            setLag(lag - 10)
        }
    }

    const openDeviceMenu = (y) => {
        setShowDeviceMenu(!showDeviceMenu)
    };

    const handleClickAway = () => {
        setShowDeviceMenu(false);
    };

    const setDeviceType = (deviceType, deviceId) => {
        devicesAPI.putDeviceType(deviceType, deviceId)
        setShowDeviceMenu(!showDeviceMenu)
    };

    const putLag = (lag) => {
        devicesAPI.putDeviceLag(props.id, lag)
        setLag(0)
    }

    const putAutolag = (lag) => {
        devicesAPI.putDeviceAutoLag(props.id)
    }




    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className={width === 1920 ? c1920.navButton : c.navButton}>
                <div>
                    Type: {props.type} <br/>
                    ID: {props.id} <br/>
                    Lag: {props.lag}
                </div>
                {props.isLockLag
                ? <div style={{color: 'grey'}}>Калибруется...</div>
                    : <div>
                        <div className={width === 1920 ? c1920.lagButton : c.lagButton} onClick={e => putAutolag()}>
                            Авто калибровка
                        </div>
                        <div className={width === 1920 ? c1920.lagButton : c.lagButton} onClick={e => putLag(0)}>
                            Обнулить lag
                        </div>
                        <div style={{display: 'inline-flex'}}>
                            <div className={width === 1920 ? c1920.lagButton : c.lagButton} onClick={e => putLag(lag)}>
                                Задать lag
                            </div>
                            <div style={{display: 'inline-flex', marginLeft: 10}}>
                                <div style={{cursor: 'pointer'}} onClick={e => minusLag()}>-</div>
                                <div style={{padding: '0 10px', margin: '0 10px', border: 'solid 1px', width: 60, textAlign: 'center'}}>{lag}</div>
                                <div style={{cursor: 'pointer'}} onClick={e => plusLag()}>+</div>
                            </div>
                        </div>
                    </div>
                }

                {props.type !== 'Admin' &&
                <div>
                    {!showDeviceMenu
                        ? <div className={width === 1920 ? c1920.changeDeviceType : c.changeDeviceType}
                               onClick={(e) => openDeviceMenu()}>
                            Назначить тип устройства
                        </div>
                        : <div className={width === 1920 ? c1920.changeDeviceType : c.changeDeviceType}
                               onClick={(e) => openDeviceMenu()}>
                            Выберете устройство
                        </div>
                    }
                    {showDeviceMenu && devicesMenu.map(d => <div className={width === 1920 ? c1920.device : c.device}
                                                                 onClick={(e) => setDeviceType(d, props.id)}>
                        {d}
                    </div>)}
                </div>
                }
            </div>
        </ClickAwayListener>
    )
};

export default Device;

