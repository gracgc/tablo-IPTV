import {teamsAPI} from "../api/api";

const ADD_GOAL = 'teams/ADD_GOAL';
const CHANGE_GAMER_STATUS = 'teams/CHANGE_GAMER_STATUS';
const ADD_GAMER_GOAL = 'teams/ADD_GAMER_GOAL';
const SET_TEAMS = 'teams/SET_TEAMS';
const GAMER_ON_FIELD = 'teams/GAMER_ON_FIELD';
const DELETE_GAMER = 'teams/DELETE_GAMER';


let initialState = {
    teams: [
        {
            name: 'Name',
            logo: "",
            color: 'white',
            counter: 0,
            teamType: 'home',
            timeOut: false,
            gamers: [
                {
                    "id": 1,
                    "fullName": "Gamer 1",
                    "gamerNumber": "00",
                    "status": "deleted",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 5000,
                    "whenWasPenalty": 8463
                },
                {
                    "id": 2,
                    "fullName": "Gamer 2",
                    "gamerNumber": "00",
                    "status": "deleted",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 5000,
                    "whenWasPenalty": 8463
                },
                {
                    "id": 3,
                    "fullName": "Gamer 3",
                    "gamerNumber": "00",
                    "status": "deleted",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 5000,
                    "whenWasPenalty": 8463
                },
                {
                    "id": 4,
                    "fullName": "Gamer 4",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 5,
                    "fullName": "Gamer 5",
                    "gamerNumber": "00",
                    "status": "deleted",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 5000,
                    "whenWasPenalty": 8463
                },
                {
                    "id": 6,
                    "fullName": "Gamer 6",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 7,
                    "fullName": "Gamer 7",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 8,
                    "fullName": "Gamer 8",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 9,
                    "fullName": "Gamer 9",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 10,
                    "fullName": "Gamer 10",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 11,
                    "fullName": "Gamer 11",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 12,
                    "fullName": "Gamer 12",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 13,
                    "fullName": "Gamer 13",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 14,
                    "fullName": "Gamer 14",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 15,
                    "fullName": "Gamer 15",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 16,
                    "fullName": "Gamer 16",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 17,
                    "fullName": "Gamer 17",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 18,
                    "fullName": "Gamer 18",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 19,
                    "fullName": "Gamer 19",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 20,
                    "fullName": "Gamer 20",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 21,
                    "fullName": "Gamer 21",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 22,
                    "fullName": "Gamer 22",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 23,
                    "fullName": "Gamer 23",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 24,
                    "fullName": "Gamer 24",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 25,
                    "fullName": "Gamer 25",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                }
            ]
        },
        {
            name: 'Name',
            logo: "",
            color: 'white',
            counter: 0,
            teamType: 'guests',
            timeOut: false,
            gamers: [
                {
                    "id": 1,
                    "fullName": "Gamer 1",
                    "gamerNumber": "00",
                    "status": "deleted",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 5000,
                    "whenWasPenalty": 8463
                },
                {
                    "id": 2,
                    "fullName": "Gamer 2",
                    "gamerNumber": "00",
                    "status": "deleted",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 5000,
                    "whenWasPenalty": 8463
                },
                {
                    "id": 3,
                    "fullName": "Gamer 3",
                    "gamerNumber": "00",
                    "status": "deleted",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 5000,
                    "whenWasPenalty": 8463
                },
                {
                    "id": 4,
                    "fullName": "Gamer 4",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 5,
                    "fullName": "Gamer 5",
                    "gamerNumber": "00",
                    "status": "deleted",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 5000,
                    "whenWasPenalty": 8463
                },
                {
                    "id": 6,
                    "fullName": "Gamer 6",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": true,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 7,
                    "fullName": "Gamer 7",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 8,
                    "fullName": "Gamer 8",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 9,
                    "fullName": "Gamer 9",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 10,
                    "fullName": "Gamer 10",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 11,
                    "fullName": "Gamer 11",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 12,
                    "fullName": "Gamer 12",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 13,
                    "fullName": "Gamer 13",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 14,
                    "fullName": "Gamer 14",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 15,
                    "fullName": "Gamer 15",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 16,
                    "fullName": "Gamer 16",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 17,
                    "fullName": "Gamer 17",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 18,
                    "fullName": "Gamer 18",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 19,
                    "fullName": "Gamer 19",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 20,
                    "fullName": "Gamer 20",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 21,
                    "fullName": "Gamer 21",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 22,
                    "fullName": "Gamer 22",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 23,
                    "fullName": "Gamer 23",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 24,
                    "fullName": "Gamer 24",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                },
                {
                    "id": 25,
                    "fullName": "Gamer 25",
                    "gamerNumber": "00",
                    "status": "in game",
                    "onField": false,
                    "goals": 0,
                    "timeOfPenalty": 0,
                    "whenWasPenalty": 0
                }
            ]
        }
    ]
};

const teamsReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_TEAMS:
            return {
                ...state,
                teams: action.teams
            };

        case ADD_GOAL:
            return {
                ...state,
                teams: state.teams.map(t => {
                    if (t.teamType === action.teamType) {
                        if (action.symbol === '+') {
                            return {...t, counter: t.counter + 1}
                        } if (action.symbol === '-') {
                            if (t.counter > 0) {
                                return {...t, counter: t.counter - 1}
                            } else {
                                return  {...t}
                            }
                        }
                    }
                    return t;
                })
            };

        case CHANGE_GAMER_STATUS:
            return {
                ...state,
                teams: state.teams.map(t => {
                        if (t.teamType === action.teamType) {
                            return {
                                ...t, gamers: t.gamers.map(g => {
                                    if (g.id === action.gamerId) {
                                        if (g.status === 'in game') {
                                            return {...g, status: 'deleted'}
                                        } else {
                                            return {...g, status: 'in game'}
                                        }
                                    }
                                    return g;
                                })
                            }
                        }
                        return t;
                    }
                )
            };

        case GAMER_ON_FIELD:
            return {
                ...state,
                teams: state.teams.map(t => {
                        if (t.teamType === action.teamType) {
                            return {
                                ...t, gamers: t.gamers.map(g => {
                                    if (g.id === action.gamerId) {
                                        if (g.onField === true) {
                                            return {...g, onField: false}
                                        }
                                        if (g.onField === false) {
                                            return {...g, onField: true}
                                        }
                                    }
                                    return g;
                                })
                            }
                        }
                        return t;
                    }
                )
            };

        case DELETE_GAMER:
            return {
                ...state,
                teams: state.teams.map(t => {
                        if (t.teamType === action.teamType) {
                            return {
                                ...t, gamers: t.gamers.map(g => {
                                    if (g.id === action.gamerId) {
                                            return {...g, penalty: action.timeOfPenalty, whenWasPenalty: action.whenWasPenalty}
                                    }
                                    return g;
                                })
                            }
                        }
                        return t;
                    }
                )
            };

        case ADD_GAMER_GOAL:
            return {
                ...state,
                teams: state.teams.map(t => {
                        if (t.teamType === action.teamType) {
                            return {
                                ...t, gamers: t.gamers.map(g => {
                                    if (g.id === action.gamerId) {
                                        if (action.symbol === '+') {
                                            return {...g, goals: g.goals + 1}
                                        }
                                        if (action.symbol === '-') {
                                            if (g.goals > 0) {
                                                return {...g, goals: g.goals - 1}
                                            } else {
                                                return {...g}
                                            }
                                        }

                                    }
                                    return g;
                                })
                            }
                        }
                        return t;
                    }
                )
            };

        default:
            return state;
    }
};

export const setTeamsAC = (teams) => ({type: SET_TEAMS, teams});
export const addGoalAC = (teamType, symbol) => ({type: ADD_GOAL, teamType, symbol});
export const changeGamerStatusAC = (teamType, gamerId) => ({type: CHANGE_GAMER_STATUS, teamType, gamerId});
export const gamerOnFieldAC = (gamerId, teamType) => ({type: GAMER_ON_FIELD, teamType, gamerId});
export const deleteGamerAC = (gamerId, teamType, timeOfPenalty, whenWasPenalty) => (
    {type: DELETE_GAMER, teamType, gamerId, timeOfPenalty, whenWasPenalty});
export const addGamerGoalAC = (gamerId, teamType, symbol) => ({type: ADD_GAMER_GOAL, teamType, gamerId, symbol});


export const getTeams = (gameNumber) => async (dispatch) => {
    let response = await teamsAPI.getTeams(gameNumber);
    dispatch(setTeamsAC(response));
};

export const gamerGoal = (gameNumber, teamType, id, symbol) => async (dispatch) => {
    let response = await teamsAPI.gamerGoal(gameNumber, teamType, id, symbol);
    if (response.resultCode === 0) {
        dispatch(addGamerGoalAC(teamType, id, symbol));
    }
};

export const teamGoal = (gameNumber, teamType, symbol) => async (dispatch) => {
    let response = await teamsAPI.teamGoal(gameNumber, teamType, symbol);
    if (response.resultCode === 0) {
    //     dispatch(addGoalAC(teamType, symbol));
    }
};

export const changeGamerStatus = (gameNumber, teamType, id) => async (dispatch) => {
    let response = await teamsAPI.gamerStatus(gameNumber, teamType, id);
    if (response.resultCode === 0) {
        dispatch(changeGamerStatusAC(teamType, id));
    }
};

export const gamerOnField = (gameNumber, teamType, id, onField) => async (dispatch) => {
    let response = await teamsAPI.gamerOnField(gameNumber, teamType, id, onField);
    if (response.resultCode === 0) {
        dispatch(gamerOnFieldAC(teamType, id));
    }
};

export const deleteGamer = (gameNumber, teamType, id, timeOfPenalty, whenWasPenalty) => async (dispatch) => {
    let response = await teamsAPI.deleteGamer(gameNumber, teamType, id, timeOfPenalty, whenWasPenalty);
    if (response.resultCode === 0) {
        dispatch(deleteGamerAC(teamType, id));
    }
};


export default teamsReducer;
