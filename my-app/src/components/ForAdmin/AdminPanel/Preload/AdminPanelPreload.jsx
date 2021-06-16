import React, {useEffect, useState} from 'react'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import Loading from "../../../Loading/Loading";
import AdminPanel from "../AdminPanel";
import {getTeams} from "../../../../redux/teams_reducer";
import {getGame, getSavedGames} from "../../../../redux/games_reducer";

const AdminPanelPreload = (props) => {

    const dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;

    const teams = useSelector(
        state => state.teamsPage.teams
    );

    const gameData = useSelector(
        state => state.gamesPage.gameData
    );


    const isFetchingGame = useSelector(
        state => state.gamesPage.isFetching
    );

    const isFetchingTeams = useSelector(
        state => state.teamsPage.isFetching
    );


    useEffect(() => {

        dispatch(getTeams(gameNumber));

        dispatch(getGame(gameNumber));

    }, []);



    return (

        <div>
            {(isFetchingGame !== 0 || isFetchingTeams !== 0)
                ? <Loading/>
                : teams && gameData && <AdminPanel teams={teams} gameData={gameData}/>
            }
        </div>
    )
};

export default compose(withRouter)(AdminPanelPreload);
