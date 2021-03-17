

const SET_DIF = 'dif/SET_DIF';
const SET_PING = 'dif/SET_PING';


let initialState = {
    dif: 0,
    ping: 0
};

const difReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_DIF:

            return {
                ...state,
                dif: action.dif
            };

        case SET_PING:

            return {
                ...state,
                ping: action.ping
            };


        default:
            return state;
    }
};


export const setDifAC = (dif) => ({type: SET_DIF, dif});
export const setPingAC = (ping) => ({type: SET_PING, ping});


export default difReducer;