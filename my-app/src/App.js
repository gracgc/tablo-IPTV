import React, {useEffect} from 'react';
import './App.css';
import {Route, withRouter, Switch, Redirect} from "react-router-dom";
import {compose} from "redux";
import AdminPanel from "./components/ForAdmin/AdminPanel/AdminPanel";
import CreateGame from "./components/MenuPanel/CreateGame/CreateGame";
import SavedGames from "./components/MenuPanel/SavedGames/SavedGames";
import TabloEditClient from "./components/ForClient/TabloEdit/TabloEditClient";
import socket from "./socket/socket";
import Tablo0 from "./components/ForClient/TabloEdit/Tablo0";
import {ConfirmProvider} from "material-ui-confirm";
import Auth from "./components/MenuPanel/Auth/Auth";
import {useDispatch, useSelector} from "react-redux";
import {authFalseAC, setIdAC} from "./redux/auth_reducer";
import Cookies from "js-cookie"
import SetDevice from "./components/MenuPanel/SetDevice/SetDevice";
import {setSocketIDAC, setStadiumAC} from "./redux/app_reducer";
import {useHistory} from "react-router";
import CustomGame from "./components/ForAdmin/AdminPanel/CustomGame/CustomGame";
import Test from "./components/MenuPanel/Test/Test";
import VideoAdmin from "./components/ForAdmin/VideoAdmin/VideoAdmin";
import Lag from "./components/MenuPanel/Lag/Lag";
import LagClient from "./components/MenuPanel/Lag/LagClient";
import STB from "./components/ForClient/TabloEdit/STB";
import PreLag from "./components/MenuPanel/Lag/PreLag";
import PreLagClient from "./components/MenuPanel/Lag/PreLagClient";


function App(props) {


    if (!window.localStorage.getItem('lag')) {
        window.localStorage.setItem('lag', '0')
    }

    const dispatch = useDispatch();

    let history = useHistory();


    const isAuth = useSelector(
        state => state.authPage.isAuth
    );

    const stadium = window.localStorage.getItem('stadium')

    useEffect(() => {
        socket.on("connect", () => {

            dispatch(setSocketIDAC(socket.id))

            socket.on(`getStadium`, stadium => {
                dispatch(setStadiumAC(stadium.stadium))
                window.localStorage.setItem('stadium', stadium.stadium.toString())

            })


            socket.on(`setDeviceLag${socket.id}_${stadium}`, lag => {
                window.localStorage.setItem('lag', lag.toString())
            })

            socket.on(`setDeviceAutolag${socket.id}_${stadium}`, res => {
                if (history.location.pathname.indexOf('tabloClient') === -1) {
                    history.push('/prelag');
                } else {
                    history.push('/prelagClient');
                }
            })
        });
    }, [])



    useEffect(() => {
        let secretToken = Cookies.get('secretToken')
        if (secretToken) {
            dispatch(setIdAC(1))
            if (isAuth !== null) {
                socket.emit(`addDevice_${stadium}`, {
                    pathname: history.location.pathname,
                    isAuth: isAuth,
                    lag: +window.localStorage.getItem('lag')
                })
            }
        } else {
            dispatch(authFalseAC(1))
            if (isAuth !== null) {
                socket.emit(`addDevice_${stadium}`, {
                    pathname: history.location.pathname,
                    isAuth: isAuth,
                    lag: +window.localStorage.getItem('lag')
                })
            }
        }
    }, [isAuth])

    useEffect(() => {
        if (isAuth === false && history.location.pathname.indexOf('tabloClient') === -1) {
            history.push("/auth")
        }
    }, [isAuth])


    return (
        <ConfirmProvider>
            <div className='app'>
                <STB/>
                <Switch>
                    <Route exact path='/'
                           render={() => <Redirect to={"/menu"}/>}/>
                    <Route exact path='/adminPanel'
                           render={() => <Redirect to={"/menu"}/>}/>
                    <Route path='/createGame' render={() => <CreateGame/>}/>
                    <Route exact path='/adminPanel'
                           render={() => <SavedGames/>}/>

                    <Route path='/adminPanel/:gameNumber?'
                           render={() => <AdminPanel/>}/>
                    <Route path='/videoAdmin/:gameNumber?'
                           render={() => <VideoAdmin/>}/>

                    <Route path='/menu' render={() => <SavedGames/>}/>
                    <Route path='/settings' render={() => <SetDevice/>}/>

                    <Route exact path='/tabloClient'
                           render={() => <Tablo0/>}/>
                    <Route exact path='/tabloClient/0' render={() => <Tablo0/>}/>
                    <Route path='/tabloClient/:gameNumber?' render={() => <TabloEditClient/>}/>
                    <Route path='/auth' render={() => <Auth/>}/>
                    <Route path='/customGame/:gameNumber?' render={() => <CustomGame/>}/>
                    <Route path='/test' render={() => <Test/>}/>
                    <Route path='/lag' render={() => <Lag/>}/>
                    <Route path='/lagClient' render={() => <LagClient/>}/>
                    <Route path='/prelag' render={() => <PreLag/>}/>
                    <Route path='/prelagClient' render={() => <PreLagClient/>}/>
                </Switch>
            </div>
        </ConfirmProvider>
    )
}

export default compose(withRouter)(App);