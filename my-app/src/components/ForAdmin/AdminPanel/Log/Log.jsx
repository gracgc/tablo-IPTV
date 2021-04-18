import React, {useEffect, useRef, useState} from 'react'
import c from './Log.module.css'
import c1920 from './Log_1920.module.css'
import {useDispatch, useSelector} from "react-redux";
import LogItem from "./LogItem";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {Field, reduxForm} from "redux-form";
import {Input} from "../../../../common/FormsControls/FormsControls";
import {addNewLog, getLog, setLogDataAC} from "../../../../redux/log_reducer";
import {reset} from 'redux-form';
import socket from "../../../../socket/socket";


const AddLogForm = (props) => {

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.logForm}>
                    <Field placeholder={'Добавить событие'} name={'addLog'}
                           component={Input}/>
                    <button className={c.addLogButton}>
                        Добавить
                    </button>
                </div>
            </form>
        </div>
    )
};

const AddLogReduxForm = reduxForm({form: 'addLog'})(AddLogForm);


const Log = (props) => {

    const dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;

    let width = window.innerWidth;

    let secondsStopwatch = Math.floor(props.timeMem / 1000) % 60;
    let minutesStopwatch = Math.floor(props.timeMem / (1000 * 60)) + (props.period - 1) * 20;

    const gameLog = useSelector(
        state => state.logPage.logData.gameLog
    );

    const logEndRef = useRef(null)

    const scrollToBottom = () => {
        logEndRef.current.scrollIntoView({ behavior: "auto" })
    }

    useEffect(scrollToBottom, [gameLog]);


    const onSubmit = (formData) => {
        if (formData.addLog !== undefined) {
            dispatch(addNewLog(gameNumber, `${minutesStopwatch}:${secondsStopwatch < 10 ? '0' : ''}${secondsStopwatch} - ${formData.addLog}`));
            dispatch(reset('addLog'))
        }
    };

    const stadium = window.localStorage.getItem('stadium')

    useEffect(() => {
        dispatch(getLog(gameNumber));
        socket.on(`getLog${gameNumber}_${stadium}`, log => {
                dispatch(setLogDataAC(log))
            }
        )
    }, []);


    return (
        <div className={width === 1920 ? c1920.log : c.log}>
            <div style={{fontSize: width === 1920 ? "32px" : "20px", marginBottom: "1%"}}>События</div>
            <div className={width === 1920 ? c1920.logWindow : c.logWindow}>
                {gameLog.map(l => <LogItem gameNumber={gameNumber} key={l.id} id={l.id} logItem={l.item}/>)}
                <div ref={logEndRef} />
            </div>
            <AddLogReduxForm onSubmit={onSubmit}/>
        </div>
    )
};

export default compose(withRouter)(Log);
