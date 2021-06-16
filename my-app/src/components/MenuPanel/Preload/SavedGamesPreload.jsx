import React, {useEffect, useState} from "react";
import SavedGames from "../SavedGames/SavedGames";
import {useDispatch, useSelector} from "react-redux";
import Loading from "../../Loading/Loading";
import {fetchingResetAC, getSavedGames, isFetchingAC, setSavedGamesAC} from "../../../redux/games_reducer";
import {getGameNumber, setGameNumberAC} from "../../../redux/app_reducer";
import socket from "../../../socket/socket";



const SavedGamesPreload = (props) => {

    const dispatch = useDispatch();

    const isFetchingGame = useSelector(
        state => state.gamesPage.isFetching
    );

    const isFetchingApp = useSelector(
        state => state.appPage.isFetching
    );

    const savedGames = useSelector(
        state => state.gamesPage.savedGames
    );

    let gameNumber = useSelector(
        state => state.appPage.gameNumber
    );


    useEffect(() => {

        dispatch(getSavedGames());
        dispatch(getGameNumber())

    }, []);



    return (

        <div>
            {(isFetchingGame !== 0 || isFetchingApp !== 0)
                ? <Loading/>
                : savedGames && gameNumber && <SavedGames savedGames={savedGames} gameNumber={gameNumber}/>
            }
        </div>
    )
};

export default SavedGamesPreload;