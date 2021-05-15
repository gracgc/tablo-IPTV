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


const TabloEditClient = (props) => {

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



        let [isShowLog, setIsShowLog] = useState(false);




        useEffect(() => {
            ////LOAD NEW DATA////
            socket.on(`getGameNumber`, gameNumberX => {
                    props.history.push(`/tabloClient/${gameNumberX}`);
                    setGameNumber(gameNumberX)
                }
            );
        }, [])


        useEffect(() => {

            ////LOG LOAD///
            dispatch(getLog(gameNumber));
            socket.on(`getLog${gameNumber}`, log => {
                    dispatch(setLogDataAC(log))
                }
            );
            ////TEAMS LOAD///
            dispatch(getTeams(gameNumber));
            socket.on(`getTeams${gameNumber}`, teams => {
                    dispatch(setTeamsAC(teams))
                }
            );

        }, [gameNumber])



        useEffect(() => {
            socket.on(`getTempLog${gameNumber}`, log => {
                    dispatch(addTempTabloLogAC(log))
                setIsShowLog(true);
                setTimeout(() => {
                    setIsShowLog(false);
                }, 5000)
                }
            );

        }, []);




        return (
            <div className={c.tabloEdit}>
                <TabloClient isShowLog={isShowLog} gameTempLog={gameTempLog} gameConsLog={gameConsLog}
                             homeTeam={homeTeam} guestsTeam={guestsTeam}
                             homeCounter={homeCounter} guestsCounter={guestsCounter}
                             gameNumber={gameNumber} />
            </div>
        )
    }
;

export default compose(withRouter)(TabloEditClient);