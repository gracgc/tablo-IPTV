import React, {useEffect, useState} from 'react'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import Loading from "../../../Loading/Loading";
import AdminPanel from "../AdminPanel";
import {getTeams} from "../../../../redux/teams_reducer";
import {getGame, getSavedGames} from "../../../../redux/games_reducer";
import {getLog} from "../../../../redux/log_reducer";

const AdminPanelPreload = (props) => {

    const dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;

    const teams = useSelector(
        state => state.teamsPage.teams
    );

    const gameData = useSelector(
        state => state.gamesPage.gameData
    );

    const gameLog = useSelector(
        state => state.logPage.logData.gameLog
    );


    const isFetchingGame = useSelector(
        state => state.gamesPage.isFetching
    );

    const isFetchingTeams = useSelector(
        state => state.teamsPage.isFetching
    );

    const isFetchingLog = useSelector(
        state => state.logPage.isFetching
    );




    useEffect(() => {

        dispatch(getLog(gameNumber));

        dispatch(getTeams(gameNumber));

        dispatch(getGame(gameNumber));

    }, []);



    return (

        <div>
            {(isFetchingGame !== 0 || isFetchingTeams !== 0 || isFetchingLog !== 0)
                ? <Loading/>
                : teams && gameData && <AdminPanel teams={teams} gameData={gameData} gameLog={gameLog}/>
            }
        </div>
    )
};

export default compose(withRouter)(AdminPanelPreload);
