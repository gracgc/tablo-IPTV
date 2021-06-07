import React, {useState} from "react";
import c from './SavedGames.module.css'
import {NavLink} from "react-router-dom";
import {putGameNumber} from "../../../redux/app_reducer";
import {useDispatch, useSelector} from "react-redux";
import c1920 from "./SavedGames_1920.module.css";
import {useConfirm} from "material-ui-confirm";
import {deleteGame} from "../../../redux/games_reducer";
import GameMenu from "./GameMenu";
import {logAPI} from "../../../api/api";
import FileDownload from "js-file-download";


const SavedGame = (props) => {

    let dispatch = useDispatch();

    const confirm = useConfirm();

    let width = window.innerWidth;


    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const setTabloGameNumber = async (gameNumber) => {
        await confirm({
            description: 'Сейчас на табло идет другая игра. Это действие может помешать игровому процессу.',
            title: 'Вы уверены?',
            confirmationText: 'Хорошо',
            cancellationText: 'Отменить'
        });
        dispatch(putGameNumber(gameNumber))
    };

    const deleteGameForever = async (gameNumber, isCurrentGame) => {
        await confirm({
            description: 'Эта игра будет безвозвратно удалена. (Не рекомендуется делать это во время того, как какая-либо игра идет сейчас)',
            title: 'Вы уверены?',
            confirmationText: 'Хорошо',
            cancellationText: 'Отменить'
        });
        dispatch(deleteGame(gameNumber));
        if (isCurrentGame) {
            dispatch(putGameNumber(0))
        }
    };

    const exportLog = () => {
        logAPI.exportLog(props.savedGame.gameNumber).then(txt => {
            FileDownload(txt, `События_${props.savedGame.gameName}_${props.savedGame.gameNumber}.txt`)
        })
    }


    return (
        <div className={width === 1920 ? c1920.savedGamesMenu : c.savedGamesMenu}>
            <div className={width === 1920 ? c1920.navButton : c.navButton}>
                {props.savedGame.gameName} — {props.savedGame.gameType}
                <div className={width === 1920 ? c1920.nameAndType : c.nameAndType}>
                    {props.savedGame.dateOfCreation}
                </div>
                <div className={width === 1920 ? c1920.tabloChose : c.tabloChose}>

                    {props.savedGame.gameNumber !== props.gameNumber
                        ? <div className={width === 1920 ? c1920.navButtonGameNumber : c.navButtonGameNumber}
                               onClick={
                                   (e) => setTabloGameNumber(props.savedGame.gameNumber)
                               }>
                            Поставить игру на табло
                        </div>
                        : <div style={{display: "inline-flex"}}>
                            <div style={{color: "#116327"}}>
                                Эта игра сейчас идет
                            </div>
                            <div className={width === 1920 ? c1920.gameIsGoing : c.gameIsGoing}>●</div>
                        </div>
                    }
                    <div className={width === 1920 ? c1920.adminChose : c.adminChose}>

                    </div>
                    <GameMenu showDeleteButton={showDeleteButton} setShowDeleteButton={setShowDeleteButton}/>

                </div>
            </div>
            {showDeleteButton &&
            <div>
                <div className={width === 1920 ? c1920.deleteButton : c.deleteButton}
                     onClick={(e) => deleteGameForever(props.savedGame.gameNumber, props.savedGame.gameNumber === props.gameNumber)}>
                    Удалить
                </div>
                <NavLink to={`/customGame/${props.savedGame.gameNumber}`}>
                    <div className={width === 1920 ? c1920.editButton : c.editButton}>
                        Редактировать
                    </div>
                </NavLink>
                <div className={width === 1920 ? c1920.editButton : c.editButton} onClick={e => exportLog()}>
                    События
                </div>
            </div>
            }
        </div>
    )
};

export default SavedGame;
