import React, {useEffect, useState} from 'react'
import c from './AdminPanel.module.css'
import TabloEdit from "./TabloEdit/TabloEdit";
import Log from "./Log/Log";
import Info from "./Info/Info";
import AddOptions from "./AddOptions/AddOptions";
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {gameAPI, tabloAPI} from "../../../api/api";
import socket from "../../../socket/socket";
import {useDispatch, useSelector} from "react-redux";
import {getTeams, setTeamsAC} from "../../../redux/teams_reducer";
import TeamInfo from "./Parameters/Teams/TeamInfo";

const AdminPanel = (props) => {

    let gameNumber = props.match.params.gameNumber;

    let [isSwitch, setIsSwitch] = useState(false)

    let [isRunningServer, setIsRunningServer] = useState(false);
    let [isRunningServerTimeout, setIsRunningServerTimeout] = useState(false);

    let [timeMem, setTimeMem] = useState();
    let [timeMemTimer, setTimeMemTimer] = useState();

    let [period, setPeriod] = useState();

    // const teams = useSelector(
    //     state => state.teamsPage.teams
    // );

    const homeTeamGamers = props.teams.find(t => t.teamType === 'home').gamers;

    const guestsTeamGamers = props.teams.find(t => t.teamType === 'guests').gamers;

    const homeTeamInfo = props.teams.find(t => t.teamType === 'home');

    const guestsTeamInfo = props.teams.find(t => t.teamType === 'guests');


    const dispatch = useDispatch();




    useEffect(() => {
        tabloAPI.getTimerStatus(gameNumber).then(r => {
            setTimeMem(r.timeData.timeMem);
            setTimeMemTimer(r.timeData.timeMemTimer);
            setPeriod(r.period);
            setIsRunningServer(r.isRunning)
            setIsRunningServerTimeout(r.timeoutData.isRunning);
        });

        socket.on(`getTime${gameNumber}`, time => {
                setTimeMem(time.timeData.timeMem);
                setTimeMemTimer(time.timeData.timeMemTimer);
                setPeriod(time.period);
                setIsRunningServer(time.isRunning);

            }
        );

        socket.on(`getTimeout${gameNumber}`, time => {
                setIsRunningServerTimeout(time.isRunning);
            }
        );
        //
        // dispatch(getTeams(gameNumber));

        socket.on(`getTeams${gameNumber}`, teams => {
                dispatch(setTeamsAC(teams))
            }
        )
    }, []);




    return (

        <div className={c.adminPanel}>
            <div className={c.info}>
                <Info gameData={props.gameData}/>
            </div>
            <div className={c.mainPanel}>
                <div>
                    <TeamInfo period={period} timeMem={timeMem} timeMemTimer={timeMemTimer}
                              isRunningServer={isRunningServer}
                              teamGamers={homeTeamGamers} teamCounter={homeTeamInfo.counter}
                              name={homeTeamInfo.name} timeOut={homeTeamInfo.timeOut} teamType={homeTeamInfo.teamType}
                              gameNumber={gameNumber} isRunningServerTimeout={isRunningServerTimeout} logo={homeTeamInfo.logo}
                              color={homeTeamInfo.color} setIsSwitch={setIsSwitch}

                    />
                </div>
                <div className={c.addPanel}>
                    <div>
                        <TabloEdit isSwitch={isSwitch} setIsSwitch={setIsSwitch}/>
                    </div>
                    <div>
                        <Log period={period} timeMem={timeMem}/>
                    </div>
                    <div>
                        <AddOptions period={period} isRunningServer={isRunningServer}/>
                    </div>
                </div>
                <div>
                    <TeamInfo period={period} timeMem={timeMem} timeMemTimer={timeMemTimer}
                              isRunningServer={isRunningServer}
                              teamGamers={guestsTeamGamers} teamCounter={guestsTeamInfo.counter}
                              name={guestsTeamInfo.name} timeOut={guestsTeamInfo.timeOut}
                              teamType={guestsTeamInfo.teamType}
                              gameNumber={gameNumber} isRunningServerTimeout={isRunningServerTimeout}
                              logo={guestsTeamInfo.logo}
                              color={guestsTeamInfo.color} setIsSwitch={setIsSwitch}
                    />
                </div>
            </div>
        </div>
    )
};

export default compose(withRouter)(AdminPanel);
