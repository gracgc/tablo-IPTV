import React from 'react'
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {addTempTabloLogAC, getLog, setLogDataAC} from "../../../redux/log_reducer";
import {getTeams, setTeamsAC} from "../../../redux/teams_reducer";
import socket from "../../../socket/socket";
import {getGame, setPresetAC} from "../../../redux/games_reducer";
import Loading from "../../Loading/Loading";
import TabloClient from "../TabloEdit/TabloClient";


const TabloClientPreload = (props) => {

    let [gameNumber, setGameNumber] = useState(props.match.params.gameNumber);

    const dispatch = useDispatch();

    const teams = useSelector(
        state => state.teamsPage.teams
    );

    const gameTempLog = useSelector(
        state => state.logPage.logData.tabloLog.tempLog
    );

    const gameConsLog = useSelector(
        state => state.logPage.logData.tabloLog.consLog
    );

    const gameData = useSelector(
        state => state.gamesPage.gameData
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

    const isFetchingLog = useSelector(
        state => state.logPage.isFetching
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

        dispatch(getLog(gameNumber));
        dispatch(getTeams(gameNumber));
        dispatch(getGame(gameNumber));

    }, [gameNumber])


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
            {(isFetchingGame !== 0 || isFetchingTeams !== 0 || isFetchingApp !== 0 || isFetchingLog !== 0)
                ? <div style={{
                    backgroundColor: '#2A2B2B',
                    width: '100vw',
                    height: '100vh'
                }}></div>
                : teams &&
                <div>
                    <TabloClient isShowLog={isShowLog} gameTempLog={gameTempLog} gameConsLog={gameConsLog}
                                 teams={teams} gameData={gameData}
                                 gameNumber={gameNumber} tabloPNG={tabloPNG}/>
                </div>
            }

        </div>
    )
};

export default compose(withRouter)(TabloClientPreload);