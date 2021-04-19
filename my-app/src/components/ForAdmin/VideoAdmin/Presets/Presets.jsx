import React, {useEffect} from 'react'
import c from './Presets.module.css'
import c1920 from './Presets_1920.module.css';
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {gameAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {getGame, setPresetAC} from "../../../../redux/games_reducer";
import socket from "../../../../socket/socket";


const Presets = (props) => {

    let width = window.innerWidth;

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const preset = useSelector(
        (state => state.gamesPage.gameData.preset)
    );




    useEffect(() => {
        dispatch(getGame(gameNumber));


        socket.on(`getPreset${gameNumber}`, preset => {
            dispatch(setPresetAC(preset))
        });
    }, [])


    let presets = [
        {preset: 1, name: 'Только табло'},
        {preset: 2, name: 'Табло и видео'},
        {preset: 3, name: 'Только видео'},
        {preset: 4, name: 'Заглушка'},
        {preset: 5, name: 'Игроки 1'},
        {preset: 6, name: 'Игроки 2'},
    ]

    return (
        <div className={width === 1920 ? c1920.presets : c.presets}>
            <div className={width === 1920 ? c1920.title : c.title}>Пресеты</div>
            {presets.map(p => <div className={width === 1920 ? c1920.preset : c.preset} style={{
                background: p.preset === preset && '#435373',
                color: p.preset === preset && '#a4e2ed'
            }}
                                   onClick={(e) => {
                                       gameAPI.putPreset(gameNumber, p.preset)
                                   }}>
                {p.name}
            </div>)}
        </div>
    )
};

export default compose(withRouter)(Presets);