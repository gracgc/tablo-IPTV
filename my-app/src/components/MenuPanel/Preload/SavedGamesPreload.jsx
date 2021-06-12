import React, {useEffect, useState} from "react";
import SavedGames from "../SavedGames/SavedGames";
import {useDispatch, useSelector} from "react-redux";
import Loading from "../../Loading/Loading";
import {fetchingResetAC, getSavedGames, isFetchingAC, setSavedGamesAC} from "../../../redux/games_reducer";
import {getGameNumber, setGameNumberAC} from "../../../redux/app_reducer";
import socket from "../../../socket/socket";




const SavedGamesPreload = (props) => {

    const isFetchingGame = useSelector(
        state => state.gamesPage.isFetching
    );

    let [isLoading, setIsLoading] = useState(true)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSavedGames());
        dispatch(getGameNumber())
    }, []);

    console.log(isFetchingGame)
    console.log(isLoading)

    useEffect(() => {
        if (isFetchingGame === 0) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
        }
    }, [isFetchingGame])


    return (

        <div>
            {isLoading
                ? <Loading/>
                : <SavedGames/>
            }
        </div>
    )
};

export default SavedGamesPreload;
