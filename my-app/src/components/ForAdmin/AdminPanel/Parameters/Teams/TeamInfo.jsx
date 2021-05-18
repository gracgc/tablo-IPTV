import React from 'react'
import c from './TeamInfo.module.css'
import c1920 from './TeamInfo_1920.module.css'
import TeamGamers from "./TeamGamers";
import {addNewLog, addNewTempLog} from "../../../../../redux/log_reducer";
import {useDispatch} from "react-redux";
import {tabloAPI} from "../../../../../api/api";
import {videosAPI} from "../../../../../api/api";
import {teamGoal} from "../../../../../redux/teams_reducer";
import {useConfirm} from "material-ui-confirm";
import TabloEdit from "../../TabloEdit/TabloEdit";


const TeamInfo = (props) => {

    const dispatch = useDispatch();

    const confirm = useConfirm();

    let width = window.innerWidth;

    let secondsStopwatch = Math.floor(props.timeMem / 1000) % 60;
    let minutesStopwatch = Math.floor(props.timeMem / (1000 * 60)) + (props.period - 1) * 20;


    let startTimeout = async () => {
        await confirm({
            description: 'Вы уверены, что хотете совершить это действие?',
            title: 'Вы уверены?',
            confirmationText: 'Хорошо',
            cancellationText: 'Отменить'
        });
        tabloAPI.putTimeoutStatus(props.gameNumber, true, 0, 0, 30000, 30000);
        dispatch(addNewLog(props.gameNumber,
            `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - Старт таймаута для ${props.name}`));
    };


    let clearTimeout = async () => {
        await confirm({
            description: 'Вы уверены, что хотете совершить это действие?',
            title: 'Вы уверены?',
            confirmationText: 'Хорошо',
            cancellationText: 'Отменить'
        });
        tabloAPI.putTimeoutStatus(props.gameNumber, false, 0, 0, 0, 0);
    };

    let addTeamGoal = async (teamType, symbol) => {
        if (symbol === '-') {
            await confirm({
                description: 'Вы уверены, что хотете убрать гол?',
                title: 'Вы уверены?',
                confirmationText: 'Хорошо',
                cancellationText: 'Отменить'
            });
            dispatch(teamGoal(props.gameNumber, teamType, symbol));
        }

        if (symbol === '+') {
            dispatch(teamGoal(props.gameNumber, teamType, symbol));
            dispatch(addNewLog(props.gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - ГОЛ для ${props.name}!`));
            // dispatch(addNewTempLog(props.gameNumber,
            //     `ГОЛ для ${props.name}!`))
            // videosAPI.playGoalGIF(props.gameNumber, teamType)
            if (props.isRunningServer) {
                props.setIsSwitch(true)
            }
        }
    }


    return (
        <div className={width === 1920 ? c1920.team : c.team}>
            <div className={width === 1920 ? c1920.teamInfo : c.teamInfo}
                 style={{textAlign: props.teamType === 'guests' && 'right'}}>
                <div style={{display: 'inline-flex'}}>
                    {props.teamType === 'home' &&
                        <img src={props.logo} alt="" width={width === 1920 ? 180 : 120}
                                            height={width === 1920 ? 180 : 120}/>

                    }

                    <div style={{marginLeft: 30, marginRight: 30, textAlign: props.teamType === 'guests' && 'right'}}>
                        <div style={{color: props.color}}>
                            {props.name}
                        </div>
                        <div className={width === 1920 ? c1920.points : c.points}>
                            Очки:
                            <div style={{
                                width: width === 1920 ? 60 : 40,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                color: 'red',
                                cursor: 'pointer'
                            }}
                                 onClick={(e) => addTeamGoal(props.teamType, '-')}>
                                −
                            </div>
                            {props.teamCounter}
                            <div style={{
                                width: width === 1920 ? 60 : 40,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                color: 'green',
                                cursor: 'pointer'
                            }}
                                 onClick={(e) => addTeamGoal(props.teamType, '+')}>
                                ＋
                            </div>
                        </div>
                    </div>
                    {props.teamType === 'guests' &&
                    <img src={props.logo} alt="" width={width === 1920 ? 180 : 120}
                         height={width === 1920 ? 180 : 120}/>
                    }
                </div>

                {!props.isRunningServer ?
                    <div>
                        {!props.isRunningServerTimeout
                            ?
                            <div className={width === 1920 ? c1920.timeout : c.timeout} onClick={(e) => startTimeout()}>
                                Взять таймаут 30 сек.
                            </div>
                            :
                            <div className={width === 1920 ? c1920.timeout : c.timeout} onClick={(e) => clearTimeout()}>
                                Отменить таймаут
                            </div>
                        }
                    </div>
                    : <div className={width === 1920 ? c1920.timeoutDis : c.timeoutDis}>
                        Взять таймаут 30 сек.
                    </div>
                }
            </div>
            <div style={{marginTop: width === 1920 ? 50 : 30}}>
                <div className={width === 1920 ? c1920.tableInfo : c.tableInfo}>
                    <div>
                        <strong>Игроки</strong>
                    </div>
                    <div>
                        На поле
                    </div>
                </div>
                <div className={width === 1920 ? c1920.teamGamers : c.teamGamers}>
                    {props.teamGamers.map(htg => <TeamGamers key={htg.id} timeMem={props.timeMem}
                                                             timeMemTimer={props.timeMemTimer}
                                                             period={props.period}
                                                             id={htg.id}
                                                             number={htg.gamerNumber}
                                                             onField={htg.onField}
                                                             fullName={htg.fullName}
                                                             status={htg.status} goals={htg.goals}
                                                             teamType={props.teamType}/>)}
                </div>
            </div>

        </div>
    )
};


export default TeamInfo;
