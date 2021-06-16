import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSavedGames} from "../../../redux/games_reducer";
import CreateGame from "../CreateGame/CreateGame";
import Loading from "../../Loading/Loading";


const CreateGamePredoad = (props) => {

    const savedGames = useSelector(
        state => state.gamesPage.savedGames
    );

    const isFetchingGame = useSelector(
        state => state.gamesPage.isFetching
    );


    let dispatch = useDispatch();


    useEffect(() => {
        dispatch(getSavedGames());
    }, []);


    return (
        <div>
            {isFetchingGame !== 0
                ? <Loading/>
                : savedGames && <CreateGame savedGames={savedGames}/>
            }
        </div>
    )
};

export default CreateGamePredoad;
