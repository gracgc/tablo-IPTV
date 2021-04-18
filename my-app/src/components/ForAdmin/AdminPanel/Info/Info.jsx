import React, {useEffect, useState} from 'react'
import c from './Info.module.css'
import c1920 from './Info_1920.module.css'
import {useDispatch, useSelector} from "react-redux";
import {getGame, setGameDataAC} from "../../../../redux/games_reducer";
import {NavLink, withRouter} from "react-router-dom";
import {compose} from "redux";
import socket from "../../../../socket/socket";
import {tabloAPI} from "../../../../api/api";
import logo from './logoIPTVPORTAL.png';
import {setDifAC, setPingAC} from "../../../../redux/dif_reducer";


const Info = (props) => {

    let lag = +window.localStorage.getItem('lag')

    let [tupit, setTupit] = useState(lag)

    const stadium = window.localStorage.getItem('stadium')

    useEffect(() => {
        socket.on(`setDeviceLag${socket.id}`, lag => {
            setTupit(lag)
        })
    }, [])

    const dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;

    const dif = useSelector(
        (state => state.difPage.dif)
    );


    const gameData = useSelector(
        state => state.gamesPage.gameData
    );

    let width = window.innerWidth;

    let [isRunningServer, setIsRunningServer] = useState(false);



    let [period, setPeriod] = useState();
    let [smallOvertime, setSmallOvertime] = useState();
    let [bigOvertime, setBigOvertime] = useState();

    let [startTime, setStartTime] = useState();

    let [deadLine, setDeadLine] = useState();

    let [timeDif, setTimeDif] = useState();
    let [timeMem, setTimeMem] = useState();
    let [timeMemTimer, setTimeMemTimer] = useState();

    let secondsStopwatch = Math.floor(timeDif / 1000) % 60;
    let minutesStopwatch = Math.floor(timeDif / (1000 * 60)) + (period - 1) * 20 + (smallOvertime * 5) + (bigOvertime * 20);


    useEffect(() => {
        dispatch(getGame(gameNumber));

        socket.on(`getGame${gameNumber}`, game => {
            dispatch(setGameDataAC(game))
        });

        tabloAPI.getTimerStatus(gameNumber, Date.now()).then(r => {


            let serverPing = Math.round((Date.now() - r.dateClient) / 2);
            let timeSyncServer = r.dateServer - r.dateClient


            dispatch(setDifAC(timeSyncServer + serverPing + tupit))
            dispatch(setPingAC(serverPing))

            setIsRunningServer(r.isRunning);
            return r
        }).then(r => {
            ////TIMER////
            setStartTime(r.runningTime);
            setTimeMem(r.timeData.timeMem);
            setTimeDif(r.timeData.timeMem);
            setTimeMemTimer(r.timeData.timeMemTimer);
            setDeadLine(r.timeData.deadLine);
            setPeriod(r.period);
            setSmallOvertime(r.smallOvertime);
            setBigOvertime(r.bigOvertime);
        });

        ////Socket IO////
        socket.on(`getTime${gameNumber}`, time => {
                setIsRunningServer(time.isRunning);
                setStartTime(time.runningTime);
                setTimeMem(time.timeData.timeMem);
                setTimeDif(time.timeData.timeMem);
                setTimeMemTimer(time.timeData.timeMemTimer);
                setDeadLine(time.timeData.deadLine);
                setPeriod(time.period);
                setSmallOvertime(time.smallOvertime);
                setBigOvertime(time.bigOvertime);
            }
        )

    }, []);




    useEffect(() => {
            let interval = setInterval(() => {
                if (isRunningServer) {
                    setTimeDif(timeMem + (Date.now() + dif - startTime));
                    setTimeMemTimer(deadLine - (timeMem + (Date.now() + dif - startTime)));
                }
            }, 50);
            return () => clearInterval(interval);
        }
    );

    return (
        <div className={width === 1920 ? c1920.info : c.info}>
            <div className={width === 1920 ? c1920.back : c.back}>

                <img src={logo} alt="" width={width === 1920 ? 70 : 50} height={width === 1920 ? 70 : 50}/>
                <NavLink to="/">
                    <div className={width === 1920 ? c1920.backButton : c.backButton}>
                        ВЕРНУТЬСЯ В МЕНЮ
                    </div>
                </NavLink>
            </div>
            <div className={width === 1920 ? c1920.nameAndType : c.nameAndType}>
                <strong>{gameData.gameName}</strong> <br/>
                {gameData.gameType}
            </div>
            <div className={width === 1920 ? c1920.statusAndTime : c.statusAndTime}>
                <div>
                    {period > 3 ? <strong>Овертайм {''}</strong> : <strong>Период {period} {''}</strong>}
                    — {gameData.gameStatus === 'Going' ? <span style={{color: 'green'}}>Идет</span> : <span style={{color: 'red'}}>Остановлена</span>}
                </div>
                <div style={{float: 'right'}}>
                    <strong>Время </strong>
                    — {minutesStopwatch}:{secondsStopwatch < 10 ? '0' : ''}{secondsStopwatch}
                </div>

            </div>

        </div>

    )
};

export default compose(withRouter)(Info);
