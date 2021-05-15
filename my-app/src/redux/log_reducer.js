import {logAPI} from "../api/api";



const ADD_LOG = 'log/ADD_LOG';
const DELETE_LOG = 'log/DELETE_LOG';
const SET_LOG_DATA = 'log/SET_LOG_DATA';
const ADD_TEMP_TABLO_LOG = 'log/ADD_TEMP_TABLO_LOG';
const ADD_CONS_TABLO_LOG = 'log/ADD_CONS_TABLO_LOG';
const DELETE_CONS_TABLO_LOG = 'log/DELETE_CONS_TABLO_LOG';

let initialState = {
    logData: {
        gameLog: [
            {item: "", id: 0}
        ],
        tabloLog: {
            tempLog: "",
            consLog: [
                {item: ""}
            ]
        }
    }
};

const logReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_LOG_DATA:

            return {
                ...state,
                logData: action.logData
            };

        case ADD_LOG:

            return {
                ...state,
                logData: {
                    ...state.logData,
                    gameLog: [...state.logData.gameLog, action.newLogItem]
                }
            };

        case DELETE_LOG:

            let newLog = [...state.logData.gameLog];
            newLog.splice(action.deletedItem, 1);

            return {
                ...state,
                logData: {
                    ...state.logData,
                    gameLog: newLog
                }
            };

        case ADD_TEMP_TABLO_LOG:

            return {
                ...state,
                logData: {
                    ...state.logData,
                    tabloLog: {
                        ...state.logData.tabloLog,
                        tempLog: action.newLogItem
                    }
                }
            };

        case ADD_CONS_TABLO_LOG:

            return {
                ...state,
                logData: {
                    ...state.logData,
                    tabloLog: {
                        ...state.logData.tabloLog,
                        consLog: [...state.logData.tabloLog.consLog, action.payload]
                    }
                }
            };

        case DELETE_CONS_TABLO_LOG:

            let newConsLog = [...state.logData.tabloLog.consLog];
            newConsLog.splice(action.deletedItem, 1);

            return {
                ...state,
                logData: {
                    ...state.logData,
                    tabloLog: {
                        ...state.logData.tabloLog,
                        consLog: newConsLog
                    }
                }
            };

        default:
            return state;
    }
};

export const setLogDataAC = (logData) => ({type: SET_LOG_DATA, logData});
export const addLogAC = (newLogItem) => ({type: ADD_LOG, newLogItem});
export const deleteLogAC = (newLogItem) => ({type: DELETE_LOG, newLogItem});
export const addTempTabloLogAC = (newLogItem) => ({type: ADD_TEMP_TABLO_LOG, newLogItem});
export const addConsTabloLogAC = (gamerId, teamType, newLogItem) => ({type: ADD_CONS_TABLO_LOG,
    payload: {id: gamerId, teamType: teamType, item: newLogItem}});
export const deleteConsTabloLogAC = (deletedItem) => ({type: DELETE_CONS_TABLO_LOG, deletedItem});

export const getLog = (gameNumber) => async (dispatch) => {
    let response = await logAPI.getLog(gameNumber);
    if (response.resultCode !== 10) {
        dispatch(setLogDataAC(response));
    }
};

export const addNewLog = (gameNumber, newLogItem) => async (dispatch) => {
    let response = await logAPI.postLog(gameNumber, newLogItem);
    if (response.resultCode === 0) {
        // dispatch(addLogAC(newLogItem));
    }
};

export const deleteLog = (gameNumber, deletedItem) => async (dispatch) => {
    let response = await logAPI.deleteLog(gameNumber, deletedItem);
    if (response.resultCode === 0) {
        // dispatch(deleteLogAC(deletedItem));
    }
};

export const addNewTempLog = (gameNumber, newLogItem) => async (dispatch) => {
    let response = await logAPI.postTempLog(gameNumber, newLogItem);
    if (response.resultCode === 0) {
        // dispatch(addTempTabloLogAC(newLogItem));
    }
};

export const addNewConsLog = (gameNumber, gamerId, teamType, newLogItem) => async (dispatch) => {
    let response = await logAPI.postConsLog(gameNumber, gamerId, teamType, newLogItem);
    if (response.resultCode === 0) {
        // dispatch(addConsTabloLogAC(gamerId, teamType, newLogItem));
    }
};

export const deleteConsLog = (gameNumber, deletedItem) => async (dispatch) => {
    let response = await logAPI.deleteConsLog(gameNumber, deletedItem);
    if (response.resultCode === 0) {
        // dispatch(deleteConsTabloLogAC(deletedItem));
    }
};


export default logReducer;
