import React, {useEffect, useState} from 'react'
import c from './Auth.module.css'
import {useDispatch, useSelector} from "react-redux";
import {Field, reduxForm, reset} from "redux-form";
import {InputPassword} from "../../../common/FormsControls/FormsControls";
import {login} from "../../../redux/auth_reducer";
import errorStyle from '../../../common/FormsControls/FormsControls.module.css'
import socket from "../../../socket/socket";
import {useHistory} from "react-router";


const AuthForm = (props) => {

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.loginForm}>
                    <div className={c.appName}>TABLO-BETA</div>
                    <Field placeholder={'Пароль'} name={'password'}
                           component={InputPassword}/>
                    {props.error && <div className={errorStyle.formSummaryError}>{props.error}</div>}
                    <button className={c.loginButton}>
                        Войти
                    </button>
                    <br/>
                    ID устройства: {props.socketID}
                </div>
            </form>
        </div>
    )
};

const LoginReduxForm = reduxForm({form: 'login'})(AuthForm);


const Auth = (props) => {

    const dispatch = useDispatch();

    const socketID = useSelector(
        state => state.appPage.socketID
    );

    const isAuth = useSelector(
        state => state.authPage.isAuth
    );

    let history = useHistory();

    const onSubmit = (formData) => {
        dispatch(login(formData.password));
    };

    useEffect(() => {
        if (isAuth) {
            socket.emit(`addDevice_${socket.io.engine.hostname}`, {pathname: history.location.pathname, isAuth: isAuth})
            history.push("/menu");
        }
    }, [isAuth])

    useEffect(() => {
        socket.on(`setDevicePage${socketID}_${socket.io.engine.hostname}`, deviceType => {
            if (deviceType === 'Main Tablo') {
                history.push("/tabloClient/0");
            } if (deviceType === 'Video') {
                history.push("/video");
            }
        })
    }, [socketID])



    return (
        <div className={c.loginPage}>
            <LoginReduxForm onSubmit={onSubmit} socketID={socketID}/>
        </div>
    )
};

export default Auth;
