// import React, {useEffect, useState} from "react";
// import c from './SetDevice.module.css'
// import * as axios from "axios";
// import {useDispatch, useSelector} from "react-redux";
// import {getTimeData, putTimeoutStatus, putTimerStatus, setTimeDataAC} from "../../../redux/tablo_reducer";
// import socket from "../../../socket/socket";
// import {addNewLog, addNewTempLog} from "../../../redux/log_reducer";
// import classNames from "classnames";
//
//
// const Settings01 = (props) => {
//
//     const dispatch = useDispatch();
//
//     let isRunningServer = useSelector(
//         state => state.tabloPage.gameTime.isRunning
//     );
//
//     let currentTime = useSelector(
//         state => state.tabloPage.gameTime.runningTime
//     );
//
//     let timeDif = useSelector(
//         state => state.tabloPage.gameTime.timeData.timeDif
//     );
//
//     let timeMem = useSelector(
//         state => state.tabloPage.gameTime.timeData.timeMem
//     );
//
//     let timeMemTimer = useSelector(
//         state => state.tabloPage.gameTime.timeData.timeMemTimer
//     );
//
//     let deadLine = useSelector(
//         state => state.tabloPage.gameTime.timeData.deadLine
//     );
//
//     let period = useSelector(
//         state => state.tabloPage.gameTime.period
//     );
//
//     let smallOvertime = useSelector(
//         state => state.tabloPage.gameTime.smallOvertime
//     );
//
//     let bigOvertime = useSelector(
//         state => state.tabloPage.gameTime.bigOvertime
//     );
//
//     let secondsStopwatch = Math.floor(timeDif / 1000) % 60;
//     let minutesStopwatch = Math.floor(timeDif / (1000 * 60)) + (period - 1) * 20;
//
//     let secondsTimer = Math.floor(timeMemTimer / 1000) % 60;
//     let minutesTimer = Math.floor(timeMemTimer / (1000 * 60));
//
//     useEffect(() => {
//         dispatch(getTimeData(1))
//         socket.on(`getTime_${socket.io.engine.hostname}`, time => {
//                 dispatch(setTimeDataAC(time))
//             }
//         )
//     }, []);
//
//     useEffect(() => {
//             let interval = setInterval(() => {
//
//                 if (isRunningServer) {
//
//                     if (timeDif >= deadLine) {
//                         if (period === 3) {
//                             dispatch(putTimerStatus(1, false, Date.now(),
//                                 0,
//                                 0,
//                                 0, 0, period + 1, smallOvertime, bigOvertime))
//                             dispatch(addNewLog(1,
//                                 `End of ${period} period`));
//                             dispatch(addNewTempLog(1,
//                                 `End of ${period} period`));
//                         }
//                         if (period > 3) {
//                             if (deadLine === 300000) {
//                                 dispatch(putTimerStatus(1, false, Date.now(),
//                                     0,
//                                     0,
//                                     0, 0, period, smallOvertime + 1, bigOvertime))
//                             }
//                             if (deadLine === 1200000) {
//                                 dispatch(putTimerStatus(1, false, Date.now(),
//                                     0,
//                                     0,
//                                     0, 0, period, smallOvertime, bigOvertime + 1));
//                             }
//                         } else {
//                             dispatch(putTimerStatus(1, false, Date.now(),
//                                 0,
//                                 0,
//                                 deadLine, deadLine, period + 1, smallOvertime, bigOvertime));
//
//                         }
//                     } else {
//                         setTimeDif(timeMem + (Date.now() - currentTime));
//                         setTimeMemTimer(deadLine - (timeMem + (Date.now() - currentTime)));
//                     }
//                 }
//             }, 10);
//             return () => clearInterval(interval);
//         }
//     );
//
//     const startGame = () => {
//         dispatch(putTimerStatus(1, true, Date.now(), timeDif, timeMem,
//             timeMemTimer, deadLine, period, smallOvertime, bigOvertime));
//
//     };
//
//     const stopGame = () => {
//         dispatch(putTimerStatus(1, false, Date.now(),
//             Date.now() - currentTime,
//             timeMem + (Date.now() - currentTime),
//             deadLine - (timeMem + (Date.now() - currentTime)),
//             deadLine, period, smallOvertime, bigOvertime));
//
//     };
//
//     return (
//             <div className={c.settings}>
//                 {timeDifLocal || timeDif} {timeMemLocal || timeMem} {timeMemTimerLocal || timeMemTimer} <br/>
//                 {minutesStopwatch}:{secondsStopwatch} <br/>
//                 {minutesTimer}:{secondsTimer} <br/>
//
//                 <div className={c.gameButtons__Active} onClick={(e) => startGame()}>
//                     Start
//                 </div>
//                 <div className={classNames(c.gameButtons__Disabled, c.gameButtons__stop)}>
//                     Stop
//                 </div>
//             </div>
//         )
//     }
// ;
//
// export default Settings01;
