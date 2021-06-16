import React from 'react'
import c from './Tablo.module.css'
import c1920 from './Tablo_1920.module.css'
import TabloEvent from "./TabloEvent";
import {useDispatch, useSelector} from "react-redux";


const Tablo = (props) => {

    let width = window.innerWidth;

    return (
        <div  style={{border: props.isRunningServer ? 'green solid 1px' : 'red solid 1px'}} className={width === 1920 ? c1920.tablo : c.tablo}>
            <div className={width === 1920 ? c1920.time : c.time}>

                {props.timeMem !== undefined && <div>
                    {props.minutesTimer <= 0 ? 0 : props.minutesTimer}:{props.secondsTimer < 10 ? '0' : ''}
                    {props.secondsTimer <= 0 ? 0 : props.secondsTimer}
                </div>}

                {/*:{props.ms}*/}
            </div>
            <div className={width === 1920 ? c1920.tempLog : c.tempLog}>{props.isShowLog && props.gameTempLog}</div>
            <div>
                {
                    (props.timeMemTimerTimeout > 0) &&
                <div className={props.secondsTimerTimeout < 6 ? (width === 1920 ? c1920.timeout5sec : c.timeout5sec)
                    : (width === 1920 ? c1920.timeout : c.timeout)}>
                    Таймаут {props.secondsTimerTimeout} секунд
                </div>}
                <div className={width === 1920 ? c1920.consLog : c.consLog}>
                    {props.gameConsLog && props.gameConsLog.map(gcl => gcl.item !== '' && <TabloEvent key={gcl.id}
                                                                                                      width={width}
                                                                                                      item={gcl.item}
                                                                                                      id={gcl.id}
                                                                                                      teamType={gcl.teamType}
                                                                                                      timeMemTimer={props.timeMemTimer}
                                                                                                      timeMem={props.timeMem}
                                                                                                      period={props.period}
                                                                                                      gameNumber={props.gameNumber}
                    />)}
                </div>

            </div>
            <div className={width === 1920 ? c1920.counters : c.counters}>
                <div>
                    <div>
                        {props.homeCounter} <br/>
                        {props.homeTeam.name}
                    </div>

                </div>
                <div>
                    <div>
                        {props.guestsCounter} <br/>
                        {props.guestsTeam.name}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Tablo;
