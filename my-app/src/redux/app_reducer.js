import {gameAPI} from "../api/api";
import socket from "../socket/socket";

const SET_GAME_NUMBER = 'app/SET_GAME_NUMBER';
const PUT_GAME_NUMBER = 'app/PUT_GAME_NUMBER';
const SET_SOCKET_ID = 'app/SET_SOCKET_ID';
const SET_STADIUM = 'app/SET_STADIUM'
const SET_TABLO_PNG = 'app/SET_TABLO_PNG'


let initialState = {
    gameNumber: 1,
    socketID: null,
    stadium: null,
    lag: 0,
    pngs: {
        tabloPNG: null
    }
};

const appReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_GAME_NUMBER:

            return {
                ...state,
                gameNumber: action.gameNumber
            };

        case PUT_GAME_NUMBER:

            return {
                ...state,
                gameNumber: action.gameNumber
            };

        case SET_SOCKET_ID:

            return {
                ...state,
                socketID: action.socketID
            };

        case SET_STADIUM:

            return {
                ...state,
                stadium: action.stadium
            };

        case SET_TABLO_PNG:

            return {
                ...state,
                pngs: {
                    ...state.pngs,
                    tabloPNG: action.tabloPNG
                }
            };


        default:
            return state;
    }
};

export const setGameNumberAC = (gameNumber) => ({type: SET_GAME_NUMBER, gameNumber});
export const setSocketIDAC = (socketID) => ({type: SET_SOCKET_ID, socketID});
export const setStadiumAC = (stadium) => ({type: SET_STADIUM, stadium});
export const putGameNumberAC = (gameNumber) => ({type: PUT_GAME_NUMBER, gameNumber});
export const setTabloPNGAC = (tabloPNG) => ({type: SET_TABLO_PNG, tabloPNG});


export const getGameNumber = () => async (dispatch) => {
    let response = await gameAPI.getGameNumber();
    if (response.resultCode !== 10) {
        dispatch(setGameNumberAC(response.gameNumber));
    }
};

export const putGameNumber = (gameNumber) => async (dispatch) => {
    let response = await gameAPI.putGameNumber(+gameNumber);
    if (response.resultCode === 0) {
        dispatch(putGameNumberAC(+gameNumber));
    }
};

export const getTabloPNG = () => async (dispatch) => {
    let response = await gameAPI.tabloPNG();

    dispatch(setTabloPNGAC(response));

};


export default appReducer;
