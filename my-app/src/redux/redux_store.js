import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import tabloReducer from "./tablo_reducer";
import teamsReducer from "./teams_reducer";
import logReducer from "./log_reducer";
import gamesReducer from "./games_reducer";
import {reducer as formReducer} from "redux-form";
import appReducer from "./app_reducer";
import authReducer from "./auth_reducer";
import videosReducer from "./videos_reducer";
import difReducer from "./dif_reducer";


let reducers = combineReducers({
    tabloPage: tabloReducer,
    difPage: difReducer,
    teamsPage: teamsReducer,
    logPage: logReducer,
    gamesPage: gamesReducer,
    appPage: appReducer,
    authPage: authReducer,
    videosPage: videosReducer,
    form: formReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers,  composeEnhancers(applyMiddleware(thunkMiddleware)));

export default store;
