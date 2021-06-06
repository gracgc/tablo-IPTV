import React, {useEffect} from 'react'
import c from './TabloClient1.module.css'
import socket from "../../../socket/socket";
import {compose} from "redux";
import {withRouter} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {
    getCurrentVideo,
    getVideoEditor,
    setCurrentVideoDataAC,
    setCurrentVideoEditorDataAC
} from "../../../redux/videos_reducer";


const Summary = (props) => {

    let homeGoals = props.homeTeam.gamers.map(g => g.goals)
    let guestGoals = props.guestsTeam.gamers.map(g => g.goals)

    let maxHomeGoal = Math.max.apply(null, homeGoals);
    let maxGuestsGoal = Math.max.apply(null, guestGoals);

    let maxHomeGoalsGamer = props.homeTeam.gamers[(homeGoals.indexOf(maxHomeGoal))];
    let maxGuestsGoalsGamer = props.guestsTeam.gamers[(guestGoals.indexOf(maxGuestsGoal))];

    let bestHomeGamers = []

    let newArr = homeGoals.slice()

    console.log(newArr)

    // for (let i; i !== -1; i = newArr.indexOf(maxHomeGoal)) {
    //
    //     let maxHomeGoalsGamer = newArr[(newArr.indexOf(maxHomeGoal))];
    //
    //     newArr[(newArr.indexOf(maxHomeGoal))].goals = 0
    //
    //
    //     if (newArr.indexOf(maxHomeGoal) !== -1) {
    //         bestHomeGamers.push(maxHomeGoalsGamer)
    //     }
    //
    // }

    // while (true) {
    //
    //     let maxHomeGoalsGamer = newArr[(newArr.indexOf(maxHomeGoal))];
    //
    //     console.log(maxHomeGoalsGamer)
    //
    //     if (newArr.indexOf(maxHomeGoal) !== -1) {
    //         bestHomeGamers.push(maxHomeGoalsGamer)
    //     } else break
    // }

    console.log(bestHomeGamers)

    return (
        <div>
            СВОДКА <br/>
            Лучший игрок {props.homeTeam.name}: {maxHomeGoalsGamer.fullName} {maxHomeGoalsGamer.gamerNumber} забивший {maxHomeGoalsGamer.goals} гола <br/>
            Лучший игрок {props.guestsTeam.name}: {maxGuestsGoalsGamer.fullName} {maxGuestsGoalsGamer.gamerNumber} забивший {maxGuestsGoalsGamer.goals} гола
        </div>
    )
};

export default compose(withRouter)(Summary);