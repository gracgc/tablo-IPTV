import React, {useEffect, useState} from "react";
import c from './CreateGame.module.css'
import c1920 from './CreateGame_1920.module.css'
import {NavLink} from "react-router-dom";
import {Field, reduxForm, change, stopSubmit} from "redux-form";
import {Input, InputImg, InputReadOnly} from "../../../common/FormsControls/FormsControls";
import {required, requiredShort} from "../../../utils/validators";
import {useDispatch, useSelector} from "react-redux";
import {createNewGame, getSavedGames, setSavedGamesAC} from "../../../redux/games_reducer";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router";

import * as axios from "axios";
import logo from "../../ForAdmin/AdminPanel/Info/logoIPTVPORTAL.png";
import PickColor from "../../PickColor/PickColor";
import socket from "../../../socket/socket";


const CreateGameForm = (props) => {

    let width = window.innerWidth;


    let [menuIsOpen, setMenuIsOpen] = useState(false);

    let addPlayer = (team, setTeam) => {
        let newArray = [...team, (team[team.length - 1]) + 1];
        setTeam(newArray)
    };

    let deletePlayer = async (team, setTeam) => {
        let newArray = [...team];
        if (newArray.length > 6) {
            await newArray.pop();
            setTeam(newArray)
        }
    };

    let openGameTypeMenu = () => {
        if (menuIsOpen === false) {
            setMenuIsOpen(true)
        } else {
            setMenuIsOpen(false)
        }
    };

    let chooseGame = async (value) => {
        await props.dispatch(change('createGame', 'gameType', value));
        setMenuIsOpen(false);
    };

    let [homeImgURL, setHomeImgURL] = useState()
    let [guestsImgURL, setGuestsImgURL] = useState()


    let [homeGifURL, setHomeGifURL] = useState()
    let [guestsGifURL, setGuestsGifURL] = useState()

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={width === 1920 ? c1920.createForm : c.createForm}>
                    <div className={width === 1920 ? c1920.createGameInputPanel : c.createGameInputPanel}>
                        <div className={width === 1920 ? c1920.createGameInput : c.createGameInput}>
                            <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Название игры</div>
                            <Field placeholder={'Название игры'} name={'gameName'}
                                   validate={[required]}
                                   component={Input}/>
                        </div>
                        <div className={width === 1920 ? c1920.createGameInput : c.createGameInput}>
                            <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Тип игры</div>

                            <Field placeholder={'Выбирете тип игры'} name={'gameType'}
                                   validate={[required]}
                                   component={InputReadOnly}/>
                            <div style={{cursor: "pointer"}} onClick={(e) => openGameTypeMenu()}>
                                <strong className={width === 1920 ? c1920.chooseGame : c.chooseGame} style={width === 1920 ? {fontSize: 32} : {fontSize: 18}}>Выбрать игру ▼</strong>
                                {menuIsOpen && props.gameTypes.map(g =>
                                    <div className={width === 1920 ? c1920.gameTypeMenu : c.gameTypeMenu}
                                         onClick={(e) => {
                                             chooseGame(g)
                                         }}>
                                        {g}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                    <div className={width === 1920 ? c1920.createTeamsInputPanel : c.createTeamsInputPanel}>
                        <div>
                            <div className={width === 1920 ? c1920.homeTeam : c.homeTeam}>
                                <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Название команды</div>
                                <div className={width === 1920 ? c1920.colorAndName : c.colorAndName}>
                                    <Field placeholder={'Название команды'} name={'homeTeamName'}
                                           validate={[required]}
                                           component={Input}/>

                                    <PickColor setColor={props.setColorHome} color={props.colorHome}/>
                                </div>

                            </div>
                            <div style={{display: 'inline-flex'}}>
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Добавить лого
                                    <input
                                        name="homeLogo"
                                        type="file"
                                        accept=".jpg, .png"
                                        hidden
                                        onChange={(e) => {
                                            props.setHomeLogo(e.target.files[0]);
                                            setHomeImgURL(URL.createObjectURL(e.target.files[0]));
                                        }}
                                    />
                                </Button>
                                {!props.homeLogo
                                    ? <span style={{marginLeft: '10px', color: 'red'}}>Добавьте лого</span>
                                    : <img style={{marginLeft: 25}} src={homeImgURL} alt=""
                                           width={width === 1920 ? 50 : 40}
                                           height={width === 1920 ? 50 : 40}/>}
                            </div>
                            <div style={{display: 'inline-flex', marginTop: 20}}>
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Анимация гола
                                    <input
                                        name="homeGif"
                                        type="file"
                                        accept=".gif"
                                        hidden
                                        onChange={(e) => {
                                            props.setHomeGif(e.target.files[0]);
                                            setHomeGifURL(URL.createObjectURL(e.target.files[0]));
                                        }}
                                    />
                                </Button>
                                {!props.homeGif
                                    ? <span style={{marginLeft: '10px', color: 'red'}}>Добавьте анимацию</span>
                                    : <img style={{marginLeft: 25}} src={homeGifURL} alt=""
                                           width={width === 1920 ? 50 : 40}
                                           height={width === 1920 ? 50 : 40}/>}
                            </div>
                            <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Игроки</div>
                            <div className={width === 1920 ? c1920.homeGamers : c.homeGamers}>
                                {props.numberOfHomePlayers.map(n => <div
                                    className={width === 1920 ? c1920.homeGamer : c.homeGamer}>
                                    <Field placeholder={(n <= 6) ? `Игрок ${n} (На поле)` :
                                        (n > 6) && `Игрок ${n} (в резерве)`} name={`homeGamer${n}`}
                                           validate={[required]}
                                           component={Input}/>
                                    <Field placeholder={`№`} name={`homeNumber${n}`}
                                           validate={[requiredShort]}
                                           component={Input}/>
                                </div>)}
                                <div className={width === 1920 ? c1920.addDeleteGamerButtons : c.addDeleteGamerButtons}>
                                    <div className={width === 1920 ? c1920.addGamerButton : c.addGamerButton}
                                         onClick={(e) =>
                                             addPlayer(props.numberOfHomePlayers, props.setNumberOfHomePlayers)}>
                                        +
                                    </div>
                                    <div className={width === 1920 ? c1920.deleteGamerButton : c.deleteGamerButton}
                                         onClick={(e) =>
                                             deletePlayer(props.numberOfHomePlayers, props.setNumberOfHomePlayers)}>
                                        -
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={width === 1920 ? c1920.guestsTeam : c.guestsTeam}>
                            <div className={width === 1920 ? c1920.homeTeam : c.homeTeam}>
                                <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Название команды</div>
                                <div className={width === 1920 ? c1920.colorAndName : c.colorAndName}>
                                    <Field placeholder={'Название команды'} name={'guestsTeamName'}
                                           validate={[required]}
                                           component={Input}/>

                                    <PickColor setColor={props.setColorGuests} color={props.colorGuests}/>

                                </div>
                            </div>
                            <div style={{display: 'inline-flex'}}>
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Добавить лого
                                    <input
                                        name="guestsLogo"
                                        type="file"
                                        accept=".jpg, .png"
                                        hidden
                                        onChange={(e) => {
                                            props.setGuestsLogo(e.target.files[0]);
                                            setGuestsImgURL(URL.createObjectURL(e.target.files[0]));
                                        }}
                                    />
                                </Button>
                                {!props.guestsLogo
                                    ? <span style={{marginLeft: '10px', color: 'red'}}>Добавьте лого</span>
                                    : <img style={{marginLeft: 25}} src={guestsImgURL} alt=""
                                           width={width === 1920 ? 50 : 40}
                                           height={width === 1920 ? 50 : 40}/>}
                            </div>
                            <div style={{display: 'inline-flex', marginTop: 20}}>
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Анимация гола
                                    <input
                                        name="guestsGif"
                                        type="file"
                                        accept=".gif"
                                        hidden
                                        onChange={(e) => {
                                            props.setGuestsGif(e.target.files[0]);
                                            setGuestsGifURL(URL.createObjectURL(e.target.files[0]));
                                        }}
                                    />
                                </Button>
                                {!props.guestsGif
                                    ? <span style={{marginLeft: '10px', color: 'red'}}>Добавьте анимацию</span>
                                    : <img style={{marginLeft: 25}} src={guestsGifURL} alt=""
                                           width={width === 1920 ? 50 : 40}
                                           height={width === 1920 ? 50 : 40}/>}
                            </div>
                            <div className={width === 1920 ? c1920.formTitle : c.formTitle}>Игроки</div>
                            <div className={width === 1920 ? c1920.homeGamers : c.homeGamers}>
                                {props.numberOfGuestsPlayers.map(n => <div
                                    className={width === 1920 ? c1920.homeGamer : c.homeGamer}>
                                    <Field placeholder={(n <= 6) ? `Игрок ${n} (На поле)` :
                                        (n > 6) && `Игрок ${n} (В резерве)`} name={`guestsGamer${n}`}
                                           validate={[required]}
                                           component={Input}/>
                                    <Field placeholder={`№`} name={`guestsNumber${n}`}
                                           validate={[requiredShort]}
                                           component={Input}/>
                                </div>)}
                                <div className={width === 1920 ? c1920.addDeleteGamerButtons : c.addDeleteGamerButtons}>
                                    <div className={width === 1920 ? c1920.addGamerButton : c.addGamerButton}
                                         onClick={(e) =>
                                             addPlayer(props.numberOfGuestsPlayers, props.setNumberOfGuestsPlayers)}>
                                        +
                                    </div>
                                    <div className={width === 1920 ? c1920.deleteGamerButton : c.deleteGamerButton}
                                         onClick={(e) =>
                                             deletePlayer(props.numberOfGuestsPlayers, props.setNumberOfGuestsPlayers)}>
                                        -
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={width === 1920 ? c1920.createGameInput : c.createGameInput}>
                    <button className={width === 1920 ? c1920.createGameButton : c.createGameButton}>
                        Создать новую игру
                    </button>
                </div>
            </form>
        </div>
    )
};

const CreateGameReduxForm = reduxForm({form: 'createGame'})(CreateGameForm);


const CreateGame = (props) => {


    let width = window.innerWidth;

    let history = useHistory();

    let [numberOfHomePlayers, setNumberOfHomePlayers] = useState([1, 2, 3, 4, 5, 6]);
    let [numberOfGuestsPlayers, setNumberOfGuestsPlayers] = useState([1, 2, 3, 4, 5, 6]);

    let [homeLogo, setHomeLogo] = useState()
    let [guestsLogo, setGuestsLogo] = useState()

    let [homeGif, setHomeGif] = useState()
    let [guestsGif, setGuestsGif] = useState()

    let [colorHome, setColorHome] = useState('#ffffff')
    let [colorGuests, setColorGuests] = useState('#ffffff')

    let gameTypes = ['Классический хоккей'];

    let [successMessage, setSuccessMessage] = useState(false);


    let lastGameNumber = props.savedGames.length !== 0 ? Math.max.apply(Math, props.savedGames.map(sg => sg.gameNumber)) : 0;

    let dispatch = useDispatch();

    let uploadLogo = (homeLogo, guestsLogo) => {

        let homeLogoFormData = new FormData;

        homeLogoFormData.append('file', homeLogo)

        let guestsLogoFormData = new FormData;

        guestsLogoFormData.append('file', guestsLogo)

        if (homeLogo) {
            axios.post(`/api/teams/homeLogo/${lastGameNumber + 1}`, homeLogoFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }

        if (guestsLogo) {
            axios.post(`/api/teams/guestsLogo/${lastGameNumber + 1}`, guestsLogoFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }

    }

    let uploadGoalGIF = (homeGif, guestsGif) => {

        let homeGifFormData = new FormData;

        homeGifFormData.append('file', homeGif)

        let guestsGifFormData = new FormData;

        guestsGifFormData.append('file', guestsGif)

        if (homeGif) {
            axios.post(`/api/teams/homeGoalGIF/${lastGameNumber + 1}`, homeGifFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }

        if (guestsGif) {
            axios.post(`/api/teams/guestsGoalGIF/${lastGameNumber + 1}`, guestsGifFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }

    }

    useEffect(() => {
        socket.on(`getSavedGames`, games => {
            dispatch(setSavedGamesAC(games));
        })
    }, []);


    const onSubmit = (formData) => {

        axios.post(`/api/teams/fastGameLogo/${lastGameNumber + 1}`, {isHomeLogo: !homeLogo, isGuestsLogo: !guestsLogo, isHomeGif: !homeGif, isGuestsGif: !guestsGif})


        dispatch(createNewGame(formData.gameName, lastGameNumber + 1, formData.gameType,
            formData.homeTeamName,
            colorHome,
            numberOfHomePlayers.map(n => ({
                id: n,
                fullName: eval(`formData.homeGamer${n}`),
                gamerNumber: eval(`formData.homeNumber${n}`),
                status: "in game",
                onField: (n <= 6),
                goals: 0,
                timeOfPenalty: 0,
                whenWasPenalty: 0
            })),
            formData.guestsTeamName,
            colorGuests,
            numberOfGuestsPlayers.map(n => ({
                id: n,
                fullName: eval(`formData.guestsGamer${n}`),
                gamerNumber: eval(`formData.guestsNumber${n}`),
                status: "in game",
                onField: (n <= 6),
                goals: 0,
                timeOfPenalty: 0,
                whenWasPenalty: 0
            }))
        ));

        uploadLogo(homeLogo, guestsLogo)

        uploadGoalGIF(homeGif, guestsGif)

        setSuccessMessage(true);

        setTimeout(() => {
            history.push('/menu');
        }, 2000)


    };


    if (successMessage) {
        return <div className={c.createGame}>
            <div className={c.successMessage}>
                Игра успешно создана!
            </div>
        </div>
    }

    return (
        <div className={c.createGame}>
            <div className={width === 1920 ? c1920.menuHeader : c.menuHeader}>
                <div className={width === 1920 ? c1920.back : c.back}>
                    <img src={logo} alt="" width={width === 1920 ? 70 : 50} height={width === 1920 ? 70 : 50}/>
                    <NavLink to="/">
                        <div className={width === 1920 ? c1920.backButton : c.backButton}>
                            ВЕРНУТЬСЯ В МЕНЮ
                        </div>
                    </NavLink>
                </div>
                <div className={width === 1920 ? c1920.menuTitle : c.menuTitle}>СОЗДАТЬ НОВУЮ ИГРУ</div>
                <div></div>
            </div>

            <div className={width === 1920 ? c1920.createGamePanel : c.createGamePanel}>
                <CreateGameReduxForm onSubmit={onSubmit}
                                     gameTypes={gameTypes}
                                     numberOfHomePlayers={numberOfHomePlayers}
                                     setNumberOfHomePlayers={setNumberOfHomePlayers}
                                     numberOfGuestsPlayers={numberOfGuestsPlayers}
                                     setNumberOfGuestsPlayers={setNumberOfGuestsPlayers}
                                     homeLogo={homeLogo}
                                     guestsLogo={guestsLogo}
                                     setHomeLogo={setHomeLogo}
                                     setGuestsLogo={setGuestsLogo}
                                     colorHome={colorHome}
                                     setColorHome={setColorHome}
                                     colorGuests={colorGuests}
                                     setColorGuests={setColorGuests}
                                     homeGif={homeGif}
                                     guestsGif={guestsGif}
                                     setHomeGif={setHomeGif}
                                     setGuestsGif={setGuestsGif}
                />
            </div>
        </div>
    )
};

export default CreateGame;
