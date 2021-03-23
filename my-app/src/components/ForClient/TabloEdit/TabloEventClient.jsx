import React, {useEffect} from 'react'
import c from './TabloClient1.module.css'
import {useSelector} from "react-redux";


const TabloEventClient = (props) => {

    const timeMemTimer = useSelector(
        (state => state.tabloPage.gameTime)
    );


    const deletedGamer = useSelector(
        state => state.teamsPage.teams.find(t => t.teamType === props.teamType).gamers.find(g => g.id === props.id)
    );

    let penaltyTimer = timeMemTimer - deletedGamer.whenWasPenalty + deletedGamer.timeOfPenalty;

    let secondsTimerOfDeletedGamer =
        Math.floor(penaltyTimer / 1000) % 60;
    let minutesTimerOfDeletedGamer =
        Math.floor(penaltyTimer / (1000 * 60));




    return (
        <div>
            {props.teamType === 'home'
                ? <div className={c.consLogItem}>
                    <div className={c.gamerNumber}  style={{position: 'absolute', top: 43*props.index, left: 0}}>
                        {deletedGamer.gamerNumber}

                    </div>
                    <div className={c.timerOfDelete} style={{position: 'absolute', top: 43*props.index, left: 70}}>
                        {minutesTimerOfDeletedGamer <= 0 ? 0 : minutesTimerOfDeletedGamer}
                        :
                        {secondsTimerOfDeletedGamer < 10 ? '0' : ''}{secondsTimerOfDeletedGamer < 1 ? 0 : secondsTimerOfDeletedGamer}

                    </div>
                </div>
                : <div className={c.consLogItem}>
                    <div className={c.timerOfDelete}  style={{position: 'absolute', top: 43*props.index, right: 70}}>
                        {minutesTimerOfDeletedGamer <= 0 ? 0 : minutesTimerOfDeletedGamer}
                        :
                        {secondsTimerOfDeletedGamer < 10 ? '0' : ''}{secondsTimerOfDeletedGamer < 1 ? 0 : secondsTimerOfDeletedGamer}
                    </div>
                    <div className={c.gamerNumber}   style={{position: 'absolute', top: 43*props.index, right: 0}}>
                        {deletedGamer.gamerNumber}
                    </div>
                </div>
            }
        </div>
    )
};

export default TabloEventClient;
