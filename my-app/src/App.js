import React, {useEffect} from 'react';
import './App.css';
import {Route, withRouter, Switch, Redirect} from "react-router-dom";
import {compose} from "redux";
import socket from "./socket/socket";
import {ConfirmProvider} from "material-ui-confirm";
import {useDispatch, useSelector} from "react-redux";
import {authFalseAC, setIdAC} from "./redux/auth_reducer";
import Cookies from "js-cookie"
import {getTabloPNG, setSocketIDAC} from "./redux/app_reducer";
import {useHistory} from "react-router";
import {devicesAPI} from "./api/api";
import STB from "./components/ForClient/TabloEdit/STB";
import Tablo0 from "./components/ForClient/TabloEdit/Tablo0";
import Loading from "./components/Loading/Loading";
import TabloClientPreload from "./components/ForClient/Preload/TabloClientPreload";
import PreLagClient from "./components/MenuPanel/Lag/PreLagClient";
import PreLag from "./components/MenuPanel/Lag/PreLag";
import LagClient from "./components/MenuPanel/Lag/LagClient";
import Lag from "./components/MenuPanel/Lag/Lag";
import SetDevice from "./components/MenuPanel/SetDevice/SetDevice";
import Auth from "./components/MenuPanel/Auth/Auth";
import Test from "./components/MenuPanel/Test/Test";
import SavedGamesPreload from "./components/MenuPanel/Preload/SavedGamesPreload";
import AdminPanelPreload from "./components/ForAdmin/AdminPanel/Preload/AdminPanelPreload";
import VideoAdminPreload from "./components/ForAdmin/VideoAdmin/Preload/VideoAdminPreload";
import CustomGamePreload from "./components/ForAdmin/AdminPanel/Preload/CustomGamePreload";
import CreateGamePredoad from "./components/MenuPanel/Preload/CreateGamePreload";



// const CreateGamePredoad = React.lazy(() => import('./components/MenuPanel/Preload/CreateGamePreload'));
// const SavedGamesPreload = React.lazy(() => import('./components/MenuPanel/Preload/SavedGamesPreload'));
// const AdminPanelPreload = React.lazy(() => import('./components/ForAdmin/AdminPanel/Preload/AdminPanelPreload'));
// const VideoAdminPreload = React.lazy(() => import('./components/ForAdmin/VideoAdmin/Preload/VideoAdminPreload'));
// const SetDevice = React.lazy(() => import('./components/MenuPanel/SetDevice/SetDevice'));
// const Auth = React.lazy(() => import('./components/MenuPanel/Auth/Auth'));
// const CustomGamePreload = React.lazy(() => import('./components/ForAdmin/AdminPanel/Preload/CustomGamePreload'));
// const Test = React.lazy(() => import('./components/MenuPanel/Test/Test'));
// const Lag = React.lazy(() => import('./components/MenuPanel/Lag/Lag'));
// const LagClient = React.lazy(() => import('./components/MenuPanel/Lag/LagClient'));
// const PreLag = React.lazy(() => import('./components/MenuPanel/Lag/PreLag'));
// const PreLagClient = React.lazy(() => import('./components/MenuPanel/Lag/PreLagClient'));


function App(props) {


    if (!window.localStorage.getItem('lag')) {
        window.localStorage.setItem('lag', '0')
    }

    const dispatch = useDispatch();

    let history = useHistory();


    const isAuth = useSelector(
        state => state.authPage.isAuth
    );

    const socketID = useSelector(
        state => state.appPage.socketID
    );


    useEffect(() => {
        socket.on("connect", () => {

            dispatch(setSocketIDAC(socket.id))

            socket.on(`setDeviceLag${socket.id}`, lag => {
                window.localStorage.setItem('lag', lag.toString())
            })

            socket.on(`setDeviceAutolag${socket.id}`, res => {
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
            if (isAuth !== null && socketID !== null) {
                devicesAPI.addDevice(history.location.pathname, isAuth, +window.localStorage.getItem('lag'))
            }
        } else {
            dispatch(authFalseAC(1))
            if (isAuth !== null && socketID !== null) {
                devicesAPI.addDevice(history.location.pathname, isAuth, +window.localStorage.getItem('lag'))
            }
        }
    }, [isAuth, socketID])

    useEffect(() => {
        if (isAuth === false && history.location.pathname.indexOf('tabloClient') === -1) {
            history.push("/auth")
        }
    }, [isAuth])

    useEffect(() => {
        dispatch(getTabloPNG())
    }, [])


    return (
        <ConfirmProvider>
            <div className='app'>
                <STB/>
                <Switch>

                    <Route exact path='/'
                           render={() => <Redirect to={"/menu"}/>}/>
                    <Route exact path='/adminPanel'
                           render={() => <Redirect to={"/menu"}/>}/>
                    <Route path='/createGame' render={() => <CreateGamePredoad/>}/>
                    <Route exact path='/adminPanel'
                           render={() => <SavedGamesPreload/>}/>
                    <Route path='/adminPanel/:gameNumber?'
                           render={() => <AdminPanelPreload/>}/>
                    <Route path='/videoAdmin/:gameNumber?'
                           render={() => <VideoAdminPreload/>}/>
                    <Route path='/menu' render={() => <SavedGamesPreload/>}/>
                    <Route path='/devices' render={() => <SetDevice/>}/>
                    <Route exact path='/tabloClient'
                           render={() => <Tablo0/>}/>
                    <Route exact path='/tabloClient/0' render={() => <Tablo0/>}/>
                    <Route path='/tabloClient/:gameNumber?' render={() => <TabloClientPreload/>}/>
                    <Route path='/auth' render={() => <Auth/>}/>
                    <Route path='/customGame/:gameNumber?' render={() => <CustomGamePreload/>}/>
                    <Route path='/test' render={() => <Test/>}/>
                    <Route path='/lag' render={() => <Lag/>}/>
                    <Route path='/lagClient' render={() => <LagClient/>}/>
                    <Route path='/prelag' render={() => <PreLag/>}/>
                    <Route path='/prelagClient' render={() => <PreLagClient/>}/>
                    {/*<Route exact path='/'*/}
                    {/*       render={() => <Redirect to={"/menu"}/>}/>*/}

                    {/*<Route exact path='/adminPanel'*/}
                    {/*       render={() => <Redirect to={"/menu"}/>}/>*/}

                    {/*<Route exact path='/videoAdmin'*/}
                    {/*       render={() => <Redirect to={"/menu"}/>}/>*/}

                    {/*<Route exact path='/customGame'*/}
                    {/*       render={() => <Redirect to={"/menu"}/>}/>*/}

                    {/*<Route exact path='/tabloClient'*/}
                    {/*       render={() => <Tablo0/>}/>*/}

                    {/*<Route exact path='/tabloClient/0' render={() => <Tablo0/>}/>*/}

                    {/*<Route path='/tabloClient/:gameNumber?' render={() => <TabloClientPreload/>}/>*/}


                    {/*<Route path='/menu' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <SavedGamesPreload/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}

                    {/*<Route path='/createGame' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <CreateGamePredoad/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}

                    {/*<Route path='/adminPanel/:gameNumber?' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <AdminPanelPreload/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}

                    {/*<Route path='/videoAdmin/:gameNumber?' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <VideoAdminPreload/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}

                    {/*<Route path='/devices' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <SetDevice/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}


                    {/*<Route path='/auth' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <Auth/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}

                    {/*<Route path='/customGame/:gameNumber?' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <CustomGamePreload/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}

                    {/*<Route path='/test' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <Test/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}

                    {/*<Route path='/lag' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <Lag/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}

                    {/*<Route path='/lagClient' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <LagClient/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}

                    {/*<Route path='/prelag' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <PreLag/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}

                    {/*<Route path='/prelagClient' render={() => {*/}
                    {/*    return <React.Suspense fallback={<Loading/>}>*/}
                    {/*        <PreLagClient/>*/}
                    {/*    </React.Suspense>*/}
                    {/*}}/>*/}


                </Switch>
            </div>
        </ConfirmProvider>
    )
}

export default compose(withRouter)(App);