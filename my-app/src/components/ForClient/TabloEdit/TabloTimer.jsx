import React, {createRef, useMemo, useRef} from 'react'
import c from './TabloClient1.module.css'
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import socket from "../../../socket/socket";
import {tabloAPI} from "../../../api/api";
import useInterval from 'use-interval'
import TabloEventClient from "./TabloEventClient";
import STB from "./STB";
import {setDifAC, setPingAC} from "../../../redux/dif_reducer";
import Dif from "../../dif/Dif";
import Cookies from "js-cookie";
import {useHistory} from "react-router";
import {setTimeDataAC} from "../../../redux/tablo_reducer";
import {devicesAPI} from "../../../api/api";


const TabloTimer = (props) => {

    let history = useHistory();

    let tupit = +window.localStorage.getItem('lag')

    // const tupit = useSelector(
    //     (state => state.appPage.lag)
    // );


    const dif = useSelector(
        (state => state.difPage.dif)
    );


    let dispatch = useDispatch();

    let [gameNumber, setGameNumber] = useState(props.gameNumber);

    // let [isNull, setIsNull] = useState()


    let [isRunningServer, setIsRunningServer] = useState(false);

    let [isRunningServerTimeout, setIsRunningServerTimeout] = useState(false);


    let [startTime, setStartTime] = useState(0);

    let [startTimeout, setStartTimeout] = useState(0);

    let [deadLine, setDeadLine] = useState(0);

    let [deadLineTimeout, setDeadLineTimeout] = useState(0);

    let [timeMem, setTimeMem] = useState(0);
    let [timeMemTimer, setTimeMemTimer] = useState(0);


    let [timeMemTimeout, setTimeMemTimeout] = useState(0);
    let [timeMemTimerTimeout, setTimeMemTimerTimeout] = useState(0);

    let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));
    let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
    let ms = timeMemTimer % 1000;

    let secondsTimerTimeout = Math.floor(timeMemTimerTimeout / 1000) % 60;


    useEffect(() => {
        ////LOAD NEW DATA////
        socket.on('getGameNumber', gameNumberX => {
                props.history.push(`/tabloClient/${gameNumberX}`);
                setGameNumber(gameNumberX)
            }
        );
    }, [])




    useEffect(() => {



        ////TIME LOAD////
        tabloAPI.getTimerStatus(gameNumber, Date.now()).then(r => {
            let serverPing = Math.round((Date.now() - r.dateClient) / 2);
            let timeSyncServer = r.dateServer - r.dateClient

            dispatch(setDifAC(timeSyncServer + serverPing + tupit))
            dispatch(setPingAC(serverPing))

            setIsRunningServer(r.isRunning)
            setIsRunningServerTimeout(r.timeoutData.isRunning)
            return r
        }).then(r => {

            ////TIMER////
            setStartTime(r.runningTime)
            setTimeMem(r.timeData.timeMem);
            setTimeMemTimer(r.timeData.timeMemTimer);
            setDeadLine(r.timeData.deadLine);
            dispatch(setTimeDataAC(r.timeData.timeMemTimer))
            ////TIMEOUT////
            setStartTimeout(r.timeoutData.runningTime);
            setTimeMemTimeout(r.timeoutData.timeData.timeMem);
            setTimeMemTimerTimeout(r.timeoutData.timeData.timeMemTimer);
            setDeadLineTimeout(r.timeoutData.timeData.deadLine);
        })


        ////Socket IO////
        socket.on(`getTime${gameNumber}`, time => {
                setIsRunningServer(time.isRunning);
                setStartTime(time.runningTime)
                setTimeMem(time.timeData.timeMem);
                setTimeMemTimer(time.timeData.timeMemTimer);
                setDeadLine(time.timeData.deadLine);
            dispatch(setTimeDataAC(time.timeData.timeMemTimer))
            }
        );

        socket.on(`getTimeout${gameNumber}`, time => {
                setIsRunningServerTimeout(time.isRunning);
                setStartTimeout(time.runningTime);
                setTimeMemTimeout(time.timeData.timeMem);
                setTimeMemTimerTimeout(time.timeData.timeMemTimer);
                setDeadLineTimeout(time.timeData.deadLine);
            }
        )
    }, [gameNumber])




    useInterval(() => {
        if (isRunningServer) {
            let time = deadLine - (timeMem + ((Date.now()) - startTime + dif))
            if (+document.getElementById("s").innerHTML !== Math.floor(time / 1000) % 60 && (Math.floor(time / 1000) % 60) >= 0) {
                if (+document.getElementById("m").innerHTML !== Math.floor(time / (1000 * 60)) && (Math.floor(time / (1000 * 60))) >= 0) {
                    document.getElementById("m").innerHTML = Math.floor(time / (1000 * 60))
                }
                document.getElementById("s").innerHTML = `${(Math.floor(time / 1000) % 60) < 10 ? 0 : ''}${Math.floor(time / 1000) % 60}`

                    //setTimeMemTimer(deadLine - (timeMem + ((Date.now()) - startTime + dif)))
                // document.getElementById("ms").innerHTML = (deadLine - (timeMem + ((Date.now()) - startTime + dif))) % 1000
            }
            dispatch(setTimeDataAC(deadLine - (timeMem + ((Date.now()) - startTime + dif))))
        }
    }, 10);

    useInterval(() => {
        if (isRunningServerTimeout) {
            let time = deadLineTimeout - (timeMemTimeout + ((Date.now()) - startTimeout + dif))
            if (+document.getElementById("tm").innerHTML !== Math.floor(time / 1000) % 60 && (Math.floor(time / 1000) % 60) >= 0) {
                document.getElementById("tm").innerHTML = Math.floor(time / 1000) % 60
            }
        }
    }, 10);


    let getLag = () => {

    }



    return (
        <div>
            <div>
                {props.preset === 1 &&
                <div>
                    <Dif/>
                    <div style={{
                        textAlign: 'center',
                        position: 'absolute',
                        left: '30px',
                        backgroundColor: 'green'
                    }}>
                    </div>
                </div>
                }
            </div>
            <STB gameNumber={props.gameNumber}/>

            <div className={c.time}>

                <span id='m'>
                    {minutesTimer}
                </span>:
                <span id='s'>
                    {secondsTimer < 10 ? `0${secondsTimer}` : `${secondsTimer}`}
                </span>
                {/*<span id='ms'*/}
                {/*      style={{display: 'none'}}*/}
                {/*>*/}

                {/*</span>*/}

            </div>

            {props.preset === 1 &&
            <div>
                {props.isShowLog ? <div className={c.tempLog}>{props.gameTempLog}</div> :
                    <div className={c.tempLog}></div>}

                <div className={c.timeout}>
                    {isRunningServerTimeout &&
                    <div>
                        Таймаут <span id='tm'>
                    {secondsTimerTimeout}
                        </span> секунд
                    </div>

                    }


                </div>


                <div className={c.consLogHome}>
                    {props.gameConsLog && props.gameConsLog.filter(gcl => (gcl.item !== '' && gcl.teamType === 'home'))
                        .map((gcl, index) =>
                            <TabloEventClient key={gcl.id}
                                              index={index}
                                              item={gcl.item}
                                              id={gcl.id}
                                              teamType={gcl.teamType}
                                              gameNumber={props.gameNumber}
                            />)}
                </div>
                <div className={c.consLogGuests}>
                    {props.gameConsLog && props.gameConsLog.filter(gcl => (gcl.item !== '' && gcl.teamType === 'guests'))
                        .map((gcl, index) =>
                            <TabloEventClient key={gcl.id}
                                              index={index}
                                              item={gcl.item}
                                              id={gcl.id}
                                              teamType={gcl.teamType}
                                              gameNumber={gameNumber}
                            />)}
                </div>
            </div>
            }
        </div>


    )
};

export default compose(withRouter)(TabloTimer);
