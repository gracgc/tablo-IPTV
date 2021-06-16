import React from 'react'
import c from './TabloEditClient.module.css'
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import TabloClient from "./TabloClient";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {addTempTabloLogAC, getLog, setLogDataAC} from "../../../redux/log_reducer";
import {getTeams, setTeamsAC} from "../../../redux/teams_reducer";
import socket from "../../../socket/socket";
import {tabloAPI} from "../../../api/api";
import useInterval from 'use-interval'
import {getGame, setPresetAC} from "../../../redux/games_reducer";
import Loading from "../../Loading/Loading";
import AdminPanel from "../../ForAdmin/AdminPanel/AdminPanel";


const TabloClientPreload = (props) => {

        let [gameNumber, setGameNumber] = useState(props.match.params.gameNumber);

        const dispatch = useDispatch();

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
            state => state.logPage.logData.tabloLog.tempLog
        );

        const gameConsLog = useSelector(
            state => state.logPage.logData.tabloLog.consLog
        );

        const preset = useSelector(
            (state => state.gamesPage.gameData.preset)
        );

        const tabloPNG = useSelector(
            (state => state.appPage.pngs.tabloPNG)
        );

        const isFetchingGame = useSelector(
            state => state.gamesPage.isFetching
        );


        const isFetchingTeams = useSelector(
            state => state.teamsPage.isFetching
        );

        const isFetchingApp = useSelector(
            state => state.appPage.isFetching
        );

        let [isShowLog, setIsShowLog] = useState(false);

        let [isHomeGoalGIF, setIsHomeGoalGIF] = useState(false)


        let [isGuestsGoalGIF, setIsGuestsGoalGIF] = useState(false)


        useEffect(() => {
            ////LOAD NEW DATA////
            socket.on(`getGameNumber`, gameNumberX => {
                    props.history.push(`/tabloClient/${gameNumberX}`);
                    setGameNumber(gameNumberX)
                }
            );
        }, [])


        useEffect(() => {

            dispatch(getLog(gameNumber));
            dispatch(getTeams(gameNumber));
            dispatch(getGame(gameNumber));

        }, [gameNumber, isHomeGoalGIF, isGuestsGoalGIF])


        useEffect(() => {

            socket.on(`getLog${gameNumber}`, log => {
                    dispatch(setLogDataAC(log))
                }
            );

            socket.on(`getTeams${gameNumber}`, teams => {
                    dispatch(setTeamsAC(teams))
                }
            );

            socket.on(`getPreset${gameNumber}`, preset => {
                dispatch(setPresetAC(preset))
            });

            socket.on(`playGoalGIF_home${gameNumber}`, res => {

                    setIsHomeGoalGIF(true)
                    setIsGuestsGoalGIF(false)
                    setTimeout(() => {
                        setIsHomeGoalGIF(false)
                    }, 5000)
                }
            );

            socket.on(`playGoalGIF_guests${gameNumber}`, res => {
                    setIsGuestsGoalGIF(true)
                    setIsHomeGoalGIF(false)
                    setTimeout(() => {
                        setIsGuestsGoalGIF(false)
                    }, 5000)
                }
            );

            socket.on(`getTempLog${gameNumber}`, log => {
                    dispatch(addTempTabloLogAC(log))
                    setIsShowLog(true);
                    setTimeout(() => {
                        setIsShowLog(false);
                    }, 5000)
                }
            );

        }, [])


        return (

            <div>
                {(isFetchingGame !== 0 || isFetchingTeams !== 0 || isFetchingApp !== 0)
                    ? <Loading/>
                    : homeTeam &&
                    <div>
                        {isHomeGoalGIF &&
                        <div style={{margin: 'auto', maxWidth: 1280, maxHeight: 720, width: 1280, height: 720}}>
                            <img src={homeTeam.goalGIF} alt=""
                                 style={{maxWidth: 1280, maxHeight: 720, width: 1280, height: 720}}/>
                        </div>
                        }
                        {isGuestsGoalGIF &&
                        <div style={{margin: 'auto', maxWidth: 1280, maxHeight: 720, width: 1280, height: 720}}>
                            <img src={guestsTeam.goalGIF} alt=""
                                 style={{maxWidth: 1280, maxHeight: 720, width: 1280, height: 720}}/>
                        </div>
                        }
                        {(!isHomeGoalGIF && !isGuestsGoalGIF) &&
                        <TabloClient isShowLog={isShowLog} gameTempLog={gameTempLog} gameConsLog={gameConsLog}
                                     homeTeam={homeTeam} guestsTeam={guestsTeam}
                                     homeCounter={homeCounter} guestsCounter={guestsCounter}
                                     gameNumber={gameNumber} preset={preset} tabloPNG={tabloPNG}/>
                        }
                    </div>
                }

            </div>
        )
    }
;

export default compose(withRouter)(TabloClientPreload);