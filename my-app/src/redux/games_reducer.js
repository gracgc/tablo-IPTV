import {gameAPI, teamsAPI} from "../api/api";

const SET_GAME_DATA = 'games/SET_GAME_DATA';
const SET_PRESET = 'games/SET_PRESET';
const SET_SAVED_GAMES = 'games/SET_SAVED_GAMES';
const CREATE_NEW_GAME = 'games/CREATE_NEW_GAME';

let initialState = {
    gameData: {
        gameName: "",
        gameNumber: null,
        gameType: "",
        preset: 1,
        gameStatus: "",
        gameTime: null
    },
    savedGames: [
        {
            gameName: "",
            gameNumber: 1,
            gameType: "",
            dateOfCreation: "",
        }
    ]
};

const gamesReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_GAME_DATA:

            return {
                ...state,
                gameData: action.gameData
            };

        case SET_PRESET:

            return {
                ...state,
                gameData: {
                    ...state.gameData,
                    preset: action.preset
                }
            };

        case SET_SAVED_GAMES:

            return {
                ...state,
                savedGames: action.savedGames
            };

        case CREATE_NEW_GAME:

            let newGame = {
                gameName: action.gameName,
                gameNumber: action.gameNumber,
                gameType: action.gameType
            };

            return {
                ...state,
                savedGames: [...state.savedGames, newGame]
            };

        default:
            return state;
    }
};

export const setGameDataAC = (gameData) => ({type: SET_GAME_DATA, gameData});
export const setPresetAC = (preset) => ({type: SET_PRESET, preset});
export const setSavedGamesAC = (savedGames) => ({type: SET_SAVED_GAMES, savedGames});
export const createNewGameAC = (gameName, gameNumber, gameType) =>
    ({type: CREATE_NEW_GAME, gameName, gameNumber, gameType});



export const getGame = (gameNumber) => async (dispatch) => {
    let response = await gameAPI.getGame(gameNumber);
    if (response.resultCode === 0) {
        dispatch(setGameDataAC(response));
    }
};

export const getSavedGames = () => async (dispatch) => {
    let response = await gameAPI.getSavedGames();
    if (response.resultCode === 0) {
        dispatch(setSavedGamesAC(response.savedGames));
    }
};

export const deleteGame = (gameNumber) => async (dispatch) => {
    let response = await gameAPI.deleteGame(gameNumber);
    if (response.resultCode === 0) {
        // dispatch(deleteGameAC(response.savedGames));
    }
};

export const createNewGame =
    (gameName, gameNumber, gameType, homeName, homeColor, homeGamers, guestsName, guestsColor, guestsGamers) => async (dispatch) => {
    let responseGame = await gameAPI.createNewGame(gameName, gameNumber, gameType);
    let responseTeam = await teamsAPI.createTeams(gameNumber, homeName, homeColor, homeGamers, guestsName, guestsColor, guestsGamers);

    // if (responseGame.resultCode === 0 && responseTeam.resultCode === 0) {
    //     dispatch(createNewGameAC(gameName, gameNumber, gameType));
    // }
};

export const customGame =
    (gameNumber, period, time, homeName, homeGamers, guestsName, guestsGamers, additionalHomeGamers, additionalGuestsGamers) => async (dispatch) => {
        let response = await gameAPI.customGame(gameNumber, period, time, homeName, homeGamers, guestsName, guestsGamers, additionalHomeGamers, additionalGuestsGamers);
        if (response.resultCode === 0) {
            // dispatch(customGameAC(gameNumber));
        }
    };

export default gamesReducer;