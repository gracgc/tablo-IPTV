import React, {useEffect, useRef, useState} from "react";
import c from './SavedGames.module.css'
import c1920 from './SavedGames_1920.module.css'
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createNewGame, getSavedGames, setSavedGamesAC} from "../../../redux/games_reducer";
import SavedGame from "./SavedGame";
import {getGameNumber, putGameNumber, setGameNumberAC} from "../../../redux/app_reducer";
import socket from "../../../socket/socket";
import {useConfirm} from "material-ui-confirm";
import {useHistory} from "react-router";
import {gameAPI, teamsAPI} from "../../../api/api";




const SavedGames = (props) => {

    const savedGames = useSelector(
        state => state.gamesPage.savedGames
    );

    let gameNumber = useSelector(
        state => state.appPage.gameNumber
    );

    let width = window.innerWidth;

    const dispatch = useDispatch();

    const confirm = useConfirm();

    let history = useHistory();

    const stadium = window.localStorage.getItem('stadium')


    useEffect(() => {
        dispatch(getSavedGames());
        dispatch(getGameNumber())

        socket.on(`getGameNumber_${stadium}`, gameNumber => {
                dispatch(setGameNumberAC(gameNumber));
            }
        );

        socket.on(`getSavedGames_${stadium}`, games => {
            dispatch(setSavedGamesAC(games));
        })

    }, []);


    let currentGame = savedGames.find(g => g.gameNumber === gameNumber)


    let lastGameNumber = savedGames.length


    let createFastGame = async () => {
        let responseGame = await gameAPI.createNewGame('Быстрая игра', lastGameNumber + 1, 'Классический хоккей');
        let responseTeam = await teamsAPI.createTeams(
            lastGameNumber + 1,
            'Команда 1',
            'white',
            [],
            'Команда 2',
            'white',
            []);

        return {responseGame, responseTeam}
    }

    const fastGameAlert = async (gameNumber) => {
        await confirm({
            description: 'После создания быстрой игры вы будете сразу перенаправлены в административную панель и на табло поставится эта игра.',
            title: 'Вы уверены?',
            confirmationText: 'Хорошо',
            cancellationText: 'Отменить'
        });

        let r = await createFastGame()

        if (r.responseGame.resultCode === 0 && r.responseTeam.resultCode === 0) {
            dispatch(putGameNumber(lastGameNumber + 1))
            history.push('/adminPanel/' + (lastGameNumber + 1));
        }

    };

    let searchGame = useRef('')

    let [searchWord, setSearchWord] = useState('')

    let search = () => {
        setSearchWord(searchGame.current.value.toLowerCase())
    }


    return (
        <div className={width === 1920 ? c1920.savedGames : c.savedGames}>
            <span className={width === 1920 ? c1920.menuTitle : c.menuTitle}>Список игр</span>
            <div className={width === 1920 ? c1920.iptv : c.iptv}>IPTV PORTAL <br/> TABLO beta</div>

            <div className={width === 1920 ? c1920.menu : c.menu}>
                <div className={width === 1920 ? c1920.search : c.search}>
                    Поиск по названию: <input className={width === 1920 ? c1920.searchInput : c.searchInput} type="text"
                                              ref={searchGame} onChange={(e) => search()}/>
                </div>
                {currentGame &&
                <div className={width === 1920 ? c1920.currentGame : c.currentGame}>
                    Текущая игра: {currentGame.gameNumber} — {currentGame.gameName} — {currentGame.gameType}
                    <NavLink to={'/adminPanel/' + currentGame.gameNumber}>
                        <div className={c.curentGameMenu}>Админ</div>
                    </NavLink>
                    <NavLink to={'/videoAdmin/' + currentGame.gameNumber}>
                        <div className={c.curentGameMenu}>Видео-админ</div>
                    </NavLink>
                </div>}
                <div className={width === 1920 ? c1920.navbar : c.navbar}>
                    {savedGames.length !== 0 && savedGames.map(sg => (sg.gameName.toLowerCase().indexOf(searchWord) !== -1) &&
                        <SavedGame gameNumber={gameNumber} savedGame={sg} savedGames={savedGames}/>)}
                </div>

            </div>


            <NavLink to="/settings">
                <div className={width === 1920 ? c1920.devicesButton : c.devicesButton}>
                    Назначения устройств
                </div>
            </NavLink>

            <NavLink to="/createGame">
                <div className={width === 1920 ? c1920.createGameButton : c.createGameButton}>
                    Создать новую игру
                </div>
            </NavLink>


            <div className={width === 1920 ? c1920.createFastGameButton : c.createFastGameButton}
                 onClick={(e) => fastGameAlert()}>
                Быстрая игра
            </div>


        </div>
    )
};

export default SavedGames;
