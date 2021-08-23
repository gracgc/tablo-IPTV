import React from 'react'
import c from './TeamGamers.module.css'
import c1920 from './TeamGamers_1920.module.css'
import {useDispatch, useSelector} from "react-redux";
import {
    changeGamerStatus,
    deleteGamer,
    gamerGoal,
    gamerOnField,
} from "../../../../../redux/teams_reducer";
import {addNewConsLog, addNewLog, addNewTempLog, deleteConsLog} from "../../../../../redux/log_reducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import GamerMenu from "./GamerMenu";


const TeamGamers = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    let width = window.innerWidth;

    let secondsStopwatch = Math.floor(props.timeMem / 1000) % 60;
    let minutesStopwatch = Math.floor(props.timeMem / (1000 * 60)) + (props.period - 1) * 20;

    const consLog = useSelector(
        state => state.logPage.logData.tabloLog.consLog
    );

    const changeStatus2 = (gameNumber, teamType, gamerId, timeOfPenalty) => {
        if (props.status === 'in game') {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - ${props.fullName} удален на ${timeOfPenalty / 60000} минуты`));
            dispatch(addNewConsLog(gameNumber, gamerId, teamType, `${props.fullName} удален на`));
            dispatch(deleteGamer(gameNumber, teamType, gamerId, timeOfPenalty, props.timeMemTimer));
        }
        if (props.status === 'deleted') {
            if (timeOfPenalty !== 0) {
                dispatch(addNewLog(gameNumber,
                    `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - ${props.fullName} удален на ${timeOfPenalty / 60000} минуты`));
                dispatch(deleteGamer(gameNumber, teamType, gamerId, timeOfPenalty, props.timeMemTimer));
            } else {
                dispatch(addNewLog(gameNumber,
                    `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} возвращается в игру`));
                dispatch(addNewTempLog(gameNumber, `${props.fullName} возвращается в игру`));
                dispatch(deleteGamer(gameNumber, teamType, gamerId, 0, 0));
                dispatch(deleteConsLog(gameNumber, consLog.findIndex(c => c.id === props.id && c.teamType === props.teamType)));
            }
        }
    };

    const changeStatus = async (gameNumber, teamType, gamerId, timeOfPenalty) => {
        if (props.status === 'in game' || (props.status === 'deleted' && timeOfPenalty === 0)) {
            await dispatch(changeGamerStatus(gameNumber, teamType, gamerId));
            changeStatus2(gameNumber, teamType, gamerId, timeOfPenalty)
        } else {
            changeStatus2(gameNumber, teamType, gamerId, timeOfPenalty)
        }
    };

    const changeGamerOnField = (gameNumber, teamType, gamerId, onField) => {
        dispatch(gamerOnField(gameNumber, teamType, gamerId, onField));
        if (props.onField === true) {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} идет на скамейку запасных`));
            dispatch(addNewTempLog(gameNumber,
                `${props.fullName} идет на скамейку запасных`))
        }
        if (props.onField === false) {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} возвращается на поле`));
            dispatch(addNewTempLog(gameNumber,
                `${props.fullName} возвращается на поле`))
        }
    };

    const addGamerGoal = (gameNumber, teamType, id, symbol) => {
        dispatch(gamerGoal(gameNumber, teamType, id, symbol));
        if (symbol === '+') {
            dispatch(addNewLog(gameNumber,
                `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} -
                 ${props.fullName} получает очко`))
        }
    };


    return (
        <div className={width === 1920 ? c1920.teamGamers : c.teamGamers}>
            <div>
                {props.number}
            </div>

            <GamerMenu gameNumber={gameNumber}
                       timeMem={props.timeMem}
                       id={props.id}
                       onField={props.onField}
                       fullName={props.fullName}
                       status={props.status} goals={props.goals}
                       teamType={props.teamType}
                       addGamerGoal={addGamerGoal}
                       changeStatus={changeStatus}/>
            <div style={{paddingLeft: "5%"}}>
                {props.status === 'in game' ? 'в игре' : 'удален'}
            </div>

            <div style={{cursor: 'pointer'}} onClick={(e) => {
                changeGamerOnField(gameNumber, props.teamType, props.id, props.onField)
            }}>
                {props.onField ? <div className={c.onField}>✓</div>: <div className={c.onBranch}>✘</div>}
            </div>

            <div style={{display: 'inline-flex'}}>
                {props.goals}
            </div>
        </div>
    )
};


export default compose(withRouter)(TeamGamers);