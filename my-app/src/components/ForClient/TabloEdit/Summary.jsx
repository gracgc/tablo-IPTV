import React, {useEffect} from 'react'
import c from './Summary.module.css'
import socket from "../../../socket/socket";
import {compose} from "redux";
import {withRouter} from "react-router";
import TabloTimer from "./TabloTimer";


const Summary = (props) => {

    let homeGoals = props.homeTeam.gamers.map(g => g.goals)
    let guestGoals = props.guestsTeam.gamers.map(g => g.goals)

    let maxHomeGoal = Math.max.apply(null, homeGoals);
    let maxGuestsGoal = Math.max.apply(null, guestGoals);


    let maxHomeGoalsGamers = props.homeTeam.gamers.filter(g => maxHomeGoal === g.goals);
    let maxGuestsGoalsGamers = props.guestsTeam.gamers.filter(g => maxGuestsGoal === g.goals);


    return (
        <div>
            <div style={{width: 1280, textAlign: 'center', fontSize: 50}}>СВОДКА МАТЧА</div>
            <br/>

            {maxHomeGoal !== 0 && <div>
                {maxHomeGoalsGamers.length < 2
                    ? <div style={{marginLeft: 20}}>
                        <div style={{fontSize: 22}}>
                            Лучший игрок
                            команды {props.homeTeam.name} принесший {maxHomeGoal} {maxHomeGoal === 1 ? 'очко' : 1 < maxHomeGoal < 5 ? 'очка' : 'очков'}
                        </div>

                        <br/>
                        {maxHomeGoalsGamers.map(g => <div style={{fontSize: 18}}>{g.gamerNumber} {g.fullName}<br/></div>)}
                    </div>
                    : <div style={{marginLeft: 20}}>
                        <div style={{fontSize: 22}}>
                            Лучшие игроки
                            команды {props.homeTeam.name} принесшие {maxHomeGoal} {maxHomeGoal === 1 ? 'очко' : 1 < maxHomeGoal < 5 ? 'очка' : 'очков'}
                        </div>
                        <br/>
                        {maxHomeGoalsGamers.map(g => <div style={{fontSize: 18}}>{g.gamerNumber} {g.fullName}<br/></div>)} <br/>
                    </div>}
            </div>}

            {maxGuestsGoal !== 0 && <div>
                {maxGuestsGoalsGamers.length < 2
                    ? <div style={{marginLeft: 20}}>
                        <div style={{fontSize: 22}}>
                            Лучший игрок
                            команды {props.guestsTeam.name} принесший {maxGuestsGoal} {maxGuestsGoal === 1 ? 'очко' : 1 < maxGuestsGoal < 5 ? 'очка' : 'очков'}
                        </div>
                        <br/>
                        {maxGuestsGoalsGamers.map(g => <div style={{fontSize: 18}}>{g.gamerNumber} {g.fullName}<br/></div>)}
                    </div>
                    : <div style={{marginLeft: 20}}>
                        <div style={{fontSize: 22}}>
                            Лучшие игроки
                            команды {props.guestsTeam.name} принесшие {maxGuestsGoal} {maxGuestsGoal === 1 ? 'очко' : 1 < maxGuestsGoal < 5 ? 'очка' : 'очков'}
                        </div>
                        <br/>
                        {maxGuestsGoalsGamers.map(g => <div style={{fontSize: 18}}>{g.gamerNumber} {g.fullName}<br/></div>)} <br/>
                    </div>}
            </div>}



            <div style={{position: 'absolute', bottom: 20, width: 1280, textAlign: 'center'}}><TabloTimer
                gameNumber={props.gameNumber} gameConsLog={props.gameConsLog}
                isShowLog={props.isShowLog} gameTempLog={props.gameTempLog}
                preset={props.preset}/></div>

            {/*{maxGuestsGoalsGamers.map(g => <div>{g.fullName} <br/></div>)}*/}
        </div>
    )
};

export default compose(withRouter)(Summary);