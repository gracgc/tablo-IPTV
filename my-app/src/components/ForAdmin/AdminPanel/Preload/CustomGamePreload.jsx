import React, {useEffect} from "react";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {getTeams} from "../../../../redux/teams_reducer";
import {getGame} from "../../../../redux/games_reducer";
import {getGameNumber} from "../../../../redux/app_reducer";
import Loading from "../../../Loading/Loading";
import CustomGame from "../CustomGame/CustomGame";



const CustomGamePreload = (props) => {

    let dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;

    const teams = useSelector(
        state => state.teamsPage.teams
    );

    const gameData = useSelector(
        state => state.gamesPage.gameData
    );

    let currentGameNumber = useSelector(
        state => state.appPage.gameNumber
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


    useEffect(() => {
        dispatch(getGameNumber())

        dispatch(getTeams(gameNumber));

        dispatch(getGame(gameNumber));

    }, []);
    


    return (
        <div>
            {(isFetchingGame !== 0 || isFetchingTeams !== 0 || isFetchingApp !== 0)
                ? <Loading/>
                : teams && gameData && currentGameNumber && <CustomGame teams={teams} gameData={gameData} currentGameNumber={currentGameNumber}/>
            }
        </div>
    )
};

export default compose(withRouter)(CustomGamePreload);