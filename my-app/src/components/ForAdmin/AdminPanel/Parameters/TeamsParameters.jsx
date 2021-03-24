import React, {useEffect, useState} from 'react'
import c from './TeamsParameters.module.css';
import c1920 from './TeamsParameters_1920.module.css'
import {useDispatch, useSelector} from "react-redux";
import TeamInfo from "./Teams/TeamInfo";
import {getTeams, setTeamsAC} from "../../../../redux/teams_reducer";
import {compose} from "redux";
import {NavLink, withRouter} from "react-router-dom";
import socket from "../../../../socket/socket";
import {gameAPI, tabloAPI} from "../../../../api/api";
import {useConfirm} from "material-ui-confirm";



const TeamsParameters = (props) => {

    let gameNumber = props.match.params.gameNumber;

    const confirm = useConfirm();

    let [isRunningServer, setIsRunningServer] = useState(false);

    let [timeMem, setTimeMem] = useState();
    let [timeMemTimer, setTimeMemTimer] = useState();

    let [period, setPeriod] = useState();

    const teams = useSelector(
        state => state.teamsPage.teams
    );

    let width = window.innerWidth;

    const dispatch = useDispatch();


    useEffect(() => {
        tabloAPI.getTimerStatus(gameNumber).then(r => {
            setTimeMem(r.timeData.timeMem);
            setTimeMemTimer(r.timeData.timeMemTimer);
            setPeriod(r.period);
            setIsRunningServer(r.isRunning)
        });

        socket.on(`getTime${gameNumber}`, time => {
                setTimeMem(time.timeData.timeMem);
                setTimeMemTimer(time.timeData.timeMemTimer);
                setPeriod(time.period);
                setIsRunningServer(time.isRunning)
            }
        );

        dispatch(getTeams(gameNumber));

        socket.on(`getTeams${gameNumber}`, teams => {
                dispatch(setTeamsAC(teams))
            }
        )
    }, []);


    const homeTeamGamers = teams.find(t => t.teamType === 'home').gamers;

    const guestsTeamGamers = teams.find(t => t.teamType === 'guests').gamers;

    const homeTeamInfo = teams.find(t => t.teamType === 'home');

    const guestsTeamInfo = teams.find(t => t.teamType === 'guests');

    let resetGame = async () => {
        await confirm({description: 'Вы уверены, что хотете обнулить игру? Все параметры вернутся к изначальным значениям.',
            title: 'Вы уверены?',
            confirmationText: 'Хорошо',
            cancellationText: 'Отменить'});
        gameAPI.resetGame(gameNumber)
    }



    return (
        <div className={c.parameters}>
            <div>
                <TeamInfo period={period} timeMem={timeMem} timeMemTimer={timeMemTimer}
                          isRunningServer={isRunningServer}
                          teamGamers={homeTeamGamers} teamCounter={homeTeamInfo.counter}
                          name={homeTeamInfo.name} timeOut={homeTeamInfo.timeOut}
                          teamType={homeTeamInfo.teamType}
                          color={homeTeamInfo.color}
                          gameNumber={gameNumber}
                />
            </div>
            <div>
                <TeamInfo period={period} timeMem={timeMem} timeMemTimer={timeMemTimer}
                          isRunningServer={isRunningServer}
                          teamGamers={guestsTeamGamers} teamCounter={guestsTeamInfo.counter}
                          name={guestsTeamInfo.name} timeOut={guestsTeamInfo.timeOut}
                          teamType={guestsTeamInfo.teamType}
                          color={guestsTeamInfo.color}
                          gameNumber={gameNumber}
                />
            </div>

            {!isRunningServer &&
            <div className={width === 1920 ? c1920.resetGameButton : c.resetGameButton} onClick={(e) => resetGame()}>
                Резет игры
            </div>}

            {!isRunningServer && <NavLink to={`/customGame/${gameNumber}`}>
                <div className={width === 1920 ? c1920.customGameButton : c.customGameButton}>
                    Кастомизировать
                </div>
            </NavLink>}



            <NavLink to="/">
                <div className={width === 1920 ? c1920.navBackButton : c.navBackButton}>
                    Вернуться в меню
                </div>
            </NavLink>
        </div>
    )
};

export default compose(withRouter)(TeamsParameters);
