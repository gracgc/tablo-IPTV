import React from 'react'
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import c1920 from "./SavedGames_1920.module.css";
import c from "./SavedGames.module.css";


const GameMenu = (props) => {

    let width = window.innerWidth;

    const openGameMenu = (y) => {
        props.setShowDeleteButton(!props.showDeleteButton)
    };

    const handleClickAway = () => {
        props.setShowDeleteButton(false)
    };


    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div onClick={openGameMenu} className={width === 1920 ? c1920.settingsButton : c.settingsButton}>⚙</div>
        </ClickAwayListener>
    )
};


export default GameMenu;
