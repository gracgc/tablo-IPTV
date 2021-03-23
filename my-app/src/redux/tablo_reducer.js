import {tabloAPI} from "../api/api";


const SET_TIME_DATA = 'time/SET_TIME_DATA';
const PUT_TIMER_STATUS = 'time/PUT_TIMER_STATUS';
const PUT_TIMEOUT_STATUS = 'time/PUT_TIMEOUT_STATUS';

let initialState = {
    gameTime: 0
};

const tabloReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_TIME_DATA:

            return {
                ...state,
                gameTime: action.timeData
            };


        default:
            return state;
    }
};

export const setTimeDataAC = (timeData) => ({type: SET_TIME_DATA, timeData});





export default tabloReducer;







