import React from 'react'
import c from './TabloEdit.module.css'
import c1920 from './TabloEdit_1920.module.css'
import {useState, useEffect} from 'react';
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";
import Tablo from "./Tablo";
import {getTeams, setTeamsAC, teamGoal} from "../../../../redux/teams_reducer";
import {addNewLog, addNewTempLog} from "../../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import socket from "../../../../socket/socket";
import {tabloAPI} from "../../../../api/api";
import useInterval from "use-interval";
import {setDifAC, setPingAC} from "../../../../redux/dif_reducer";
import Dif from "../../../dif/Dif";
import Cookies from "js-cookie";


const TabloEdit = (props) => {

    // let tupit = +Cookies.get('tupit')

    let tupit = 0

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    let width = window.innerWidth;

    const dif = useSelector(
        (state => state.difPage.dif)
    );

    const ping = useSelector(
        (state => state.difPage.ping)
    );


    const homeTeam = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'home'))
    );

    const guestsTeam = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'guests'))
    );

    const homeCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'home').counter)
    );

    const guestsCounter = useSelector(
        (state => state.teamsPage.teams.find(t => t.teamType === 'guests').counter)
    );

    const gameTempLog = useSelector(
        state => state.logPage.logData.tabloLog.tempLog[state.logPage.logData.tabloLog.tempLog.length - 1].item
    );

    const gameConsLog = useSelector(
        state => state.logPage.logData.tabloLog.consLog
    );

    const gameTempLogDep = useSelector(
        state => state.logPage.logData.tabloLog.tempLog
    );


    let [count, setCount] = useState(0);

    let [isShowLog, setIsShowLog] = useState(false);

    let [isRunningServer, setIsRunningServer] = useState(false);

    let [isRunningServerTimeout, setIsRunningServerTimeout] = useState(false);


    let [tick, setTick] = useState(1000);


    let [period, setPeriod] = useState();
    let [smallOvertime, setSmallOvertime] = useState();
    let [bigOvertime, setBigOvertime] = useState();

    let [startTime, setStartTime] = useState(0);

    let [startTimeout, setStartTimeout] = useState(0);

    let [deadLine, setDeadLine] = useState(0);

    let [deadLineTimeout, setDeadLineTimeout] = useState(0);

    let [timeDif, setTimeDif] = useState(0);
    let [timeMem, setTimeMem] = useState(0);
    let [timeMemTimer, setTimeMemTimer] = useState(0);


    let [timeDifTimeout, setTimeDifTimeout] = useState(0);
    let [timeMemTimeout, setTimeMemTimeout] = useState(0);
    let [timeMemTimerTimeout, setTimeMemTimerTimeout] = useState(0);

    let secondsStopwatch = Math.floor(timeDif / 1000) % 60;
    let minutesStopwatch = Math.floor(timeDif / (1000 * 60)) + (period - 1) * 20 + (smallOvertime * 5) + (bigOvertime * 20);

    let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
    let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));

    let secondsTimerTimeout = Math.floor(timeMemTimerTimeout / 1000) % 60;


    useEffect(() => {
        tabloAPI.getTimerStatus(gameNumber, Date.now()).then(r => {


            let serverPing = Math.round((Date.now() - r.dateClient) / 2);
            let timeSyncServer = r.dateServer - r.dateClient

            dispatch(setDifAC(timeSyncServer + serverPing))
            dispatch(setPingAC(serverPing))
            setIsRunningServer(r.isRunning);
            setIsRunningServerTimeout(r.timeoutData.isRunning);
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
            ////TIMEOUT////
            setStartTimeout(r.timeoutData.runningTime);
            setTimeMemTimeout(r.timeoutData.timeData.timeMem);
            setTimeDifTimeout(r.timeoutData.timeData.timeMem);
            setTimeMemTimerTimeout(r.timeoutData.timeData.timeMemTimer);
            setDeadLineTimeout(r.timeoutData.timeData.deadLine);
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
        );


        socket.on(`getTimeout${gameNumber}`, time => {
                setIsRunningServerTimeout(time.isRunning);
                setStartTimeout(time.runningTime);
                setTimeDifTimeout(time.timeData.timeDif);
                setTimeMemTimeout(time.timeData.timeMem);
                setTimeMemTimerTimeout(time.timeData.timeMemTimer);
                setDeadLineTimeout(time.timeData.deadLine);
            }
        );

        ////TEAMS LOAD///
        dispatch(getTeams(gameNumber));
        socket.on(`getTeams${gameNumber}`, teams => {
                dispatch(setTeamsAC(teams))
            }
        );
    }, []);

    useEffect(() => {
        setIsShowLog(true);
        setTimeout(() => {
            setIsShowLog(false);
        }, 5000)
    }, [gameTempLogDep.length]);




    useEffect(() => {
        if (timeDif >= deadLine && isRunningServer) {
            setIsRunningServer(false);
            if (period === 3) {
                tabloAPI.putTimerStatus(gameNumber, false,
                    0,
                    0,
                    0, 0, period + 1, smallOvertime, bigOvertime);
                dispatch(addNewLog(gameNumber,
                    `Конец ${period} периода`));
                dispatch(addNewTempLog(gameNumber,
                    `Конец ${period} периода`));
            }
            if (period > 3) {
                if (deadLine === 300000) {
                    tabloAPI.putTimerStatus(gameNumber, false,
                        0,
                        0,
                        0, 0, period, smallOvertime + 1, bigOvertime);
                    dispatch(addNewLog(gameNumber,
                        `Конец овертайма`));
                    dispatch(addNewTempLog(gameNumber,
                        `Конец овертайма`));
                }
                if (deadLine === 1200000) {
                    tabloAPI.putTimerStatus(gameNumber, false,
                        0,
                        0,
                        0, 0, period, smallOvertime, bigOvertime + 1);
                    dispatch(addNewLog(gameNumber,
                        `Конец овертайма`));
                    dispatch(addNewTempLog(gameNumber,
                        `Конец овертайма`));
                }
            } else {
                tabloAPI.putTimerStatus(gameNumber, false,
                    0,
                    0,
                    deadLine, deadLine, period + 1, smallOvertime, bigOvertime);
                dispatch(addNewLog(gameNumber,
                    `Конец ${period} периода`));
                dispatch(addNewTempLog(gameNumber,
                    `Конец ${period} периода`));
            }
        }
    }, [timeDif >= deadLine]);

    useEffect(() => {
        if (timeDifTimeout >= deadLineTimeout && isRunningServerTimeout) {
            setIsRunningServerTimeout(false);

            tabloAPI.putTimeoutStatus(gameNumber, false,
                0,
                0,
                0, 0);
            dispatch(addNewLog(gameNumber,
                `Конец таймаута`));
            dispatch(addNewTempLog(gameNumber,
                `Конец таймаута`));
        }
    }, [timeDifTimeout >= deadLineTimeout]);

    let ms = timeMemTimer % 1000;

    useInterval(() => {
        if (isRunningServer) {
            setTimeDif(timeMem + ((Date.now()) - startTime + dif));
            setTimeMemTimer(deadLine - (timeMem + ((Date.now()) - startTime + dif)));
        }
        if (isRunningServerTimeout) {
            setTimeDifTimeout(timeMemTimeout + ((Date.now()) - startTimeout + dif));
            setTimeMemTimerTimeout(deadLineTimeout - (timeMemTimeout + ((Date.now()) - startTimeout + dif)));
        }
    }, 33);


    const addTeamGoal = async (teamType, teamName, symbol) => {
        dispatch(teamGoal(gameNumber, teamType, symbol));
        if (symbol === '+') {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - ГОЛ для ${teamName}!`));
            dispatch(addNewTempLog(gameNumber,
                `ГОЛ для ${teamName}!`))
        }
    };

    const startGame = () => {
        tabloAPI.putTimerStatus(gameNumber, true, timeDif,
            timeMem,
            timeMemTimer,
            deadLine, period, smallOvertime, bigOvertime);
        dispatch(addNewLog(gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - СТАРТ`));
    };

    const stopGame = () => {
        tabloAPI.putTimerStatus(gameNumber, false,
            timeMem + (Date.now() + dif) - startTime,
            timeMem + ((Date.now() + dif) - startTime),
            deadLine - (timeMem + ((Date.now() + dif) - startTime)),
            deadLine, period, smallOvertime, bigOvertime);
        dispatch(addNewLog(gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - СТОП`));
    };


    return (
        <div className={width === 1920 ? c1920.tabloEdit : c.tabloEdit}>
            {props.history.location.pathname.indexOf('videoAdmin') === -1 &&
            <div>
                {isRunningServer ?
                    <div className={width === 1920 ? c1920.gameButtons : c.gameButtons}>
                        <div style={{backgroundColor: 'green'}} className={width === 1920 ? c1920.gameButtons__Disabled : c.gameButtons__Disabled}>
                            СТАРТ
                        </div>
                        <div style={{backgroundColor: 'red'}}
                            className={classNames(width === 1920 ? c1920.gameButtons__Active : c.gameButtons__Active, width === 1920
                                ? c1920.gameButtons__stop : c.gameButtons__stop)}
                            onClick={(e) => stopGame()}>
                            СТОП
                        </div>
                    </div>
                    :
                    <div className={width === 1920 ? c1920.gameButtons : c.gameButtons}>
                        <div style={{backgroundColor: 'green'}} className={width === 1920 ? c1920.gameButtons__Active : c.gameButtons__Active}
                             onClick={(e) => startGame()}>
                            СТАРТ
                        </div>
                        <div style={{backgroundColor: 'red'}}
                            className={classNames(width === 1920 ? c1920.gameButtons__Disabled : c.gameButtons__Disabled, width === 1920
                                ? c1920.gameButtons__stop : c.gameButtons__stop)}>
                            СТОП
                        </div>
                    </div>
                }
            </div>}
            <div className={width === 1920 ? c1920.tablo : c.tablo}>
                <Tablo isShowLog={isShowLog} gameTempLog={gameTempLog} gameConsLog={gameConsLog}
                       secondsTimer={secondsTimer} minutesTimer={minutesTimer} timeMemTimerTimeout={timeMemTimerTimeout}
                       secondsTimerTimeout={secondsTimerTimeout} homeTeam={homeTeam} guestsTeam={guestsTeam}
                       homeCounter={homeCounter} guestsCounter={guestsCounter} timeMemTimer={timeMemTimer}
                       timeMem={timeMem}
                       period={period}
                       isRunningServer={isRunningServer}
                       addTeamGoal={addTeamGoal}
                       gameNumber={gameNumber} ms={ms}/>
            </div>
            {props.history.location.pathname.indexOf('videoAdmin') === -1 &&
            <div>
                <div className={width === 1920 ? c1920.beepButtons : c.beepButtons}>
                    <div className={width === 1920 ? c1920.beepButtons_beep : c.beepButtons_beep}>БИП</div>
                    <div className={width === 1920 ? c1920.beepButtons_beep : c.beepButtons_beep}>БИИИИИП</div>
                </div>
            </div>}
            <Dif/>
        </div>
    )
};

export default compose(withRouter)(TabloEdit);
