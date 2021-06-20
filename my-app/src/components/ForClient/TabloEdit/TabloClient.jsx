import React, {useEffect, useState} from 'react'
import c from './TabloClient1.module.css'
import c2 from './TabloClient2.module.css'
import c3 from './TabloClient3.module.css'
import {useDispatch, useSelector} from "react-redux";
import socket from "../../../socket/socket";
import classNames from 'classnames'
import TabloTimer from "./TabloTimer";
import tablo from './../../../content/img/tanlo.png';
import {gameAPI} from "../../../api/api";
import Summary from "./Summary";


const TabloClient = (props) => {

    const homeTeam = props.teams.find(t => t.teamType === 'home')

    const guestsTeam = props.teams.find(t => t.teamType === 'guests')

    const homeCounter = props.teams.find(t => t.teamType === 'home').counter

    const guestsCounter = props.teams.find(t => t.teamType === 'guests').counter

    let [isHomeGoalGIF, setIsHomeGoalGIF] = useState(false)

    let [isGuestsGoalGIF, setIsGuestsGoalGIF] = useState(false)

    useEffect(() => {
        socket.on(`playGoalGIF_home${props.gameNumber}`, res => {
                setIsHomeGoalGIF(true)
                setIsGuestsGoalGIF(false)
                setTimeout(() => {
                    setIsHomeGoalGIF(false)
                }, 5000)
            }
        );

        socket.on(`playGoalGIF_guests${props.gameNumber}`, res => {
                setIsGuestsGoalGIF(true)
                setIsHomeGoalGIF(false)
                setTimeout(() => {
                    setIsGuestsGoalGIF(false)
                }, 5000)
            }
        );
    }, [])

    console.log('render tablo')


    return (
        <div className={c.tablo}>
            <div style={{margin: 'auto', maxWidth: 1280, maxHeight: 720, width: 1280, height: 720, zIndex: 1900, position: 'absolute',
                display: isHomeGoalGIF ? 'block' : 'none'
            }}>
                <img src={props.teams.find(t => t.teamType === 'home').goalGIF} alt=""
                     style={{maxWidth: 1280, maxHeight: 720, width: 1280, height: 720}}/>
            </div>

            <div style={{margin: 'auto', maxWidth: 1280, maxHeight: 720, width: 1280, height: 720, zIndex: 1900, position: 'absolute',
                display: isGuestsGoalGIF ? 'block' : 'none'}}>
                <img src={props.teams.find(t => t.teamType === 'guests').goalGIF} alt=""
                     style={{maxWidth: 1280, maxHeight: 720, width: 1280, height: 720}}/>
            </div>

            {props.gameData.preset === 1 &&
            <div className={c.tablo1}>


                <div>
                    <TabloTimer gameNumber={props.gameNumber} gameConsLog={props.gameConsLog}
                                isShowLog={props.isShowLog} gameTempLog={props.gameTempLog} preset={props.gameData.preset}/>
                </div>

                <div>
                    <div className={classNames(c.logo, c.homeLogo)}>
                        <img src={homeTeam.logo} style={{width: 380, height: 380}} alt=""/>
                    </div>
                    <div className={classNames(c.logo, c.guestsLogo)}>
                        <img src={guestsTeam.logo} style={{width: 380, height: 380}} alt=""/>
                    </div>
                </div>
                <div>
                    <div className={classNames(c.counter, c.homeTeamCounter)}>
                        {homeCounter}
                    </div>
                    <div className={classNames(c.counter, c.guestsTeamCounter)}>
                        {guestsCounter}
                    </div>
                    <div className={classNames(c.name, c.homeTeamName)}>
                        {homeTeam.name}
                    </div>
                    <div className={classNames(c.name, c.guestsTeamName)}>
                        {guestsTeam.name}
                    </div>
                </div>
                <div style={{zIndex: -1, position: 'fixed', top: 0}}>
                    <img src={props.tabloPNG} alt=""/>
                </div>

            </div>
            }

            {props.gameData.preset === 2 &&
            <div className={c2.tablo2}>
                <div className={classNames(c2.counter2, c2.homeTeam2)}>
                    {homeCounter} <br/>
                    {homeTeam.name.slice(0, 5).toUpperCase()}
                </div>
                <div className={c2.time2}>
                    <TabloTimer gameNumber={props.gameNumber} gameConsLog={props.gameConsLog}
                                isShowLog={props.isShowLog} gameTempLog={props.gameTempLog} preset={props.gameData.preset}/>
                </div>
                <div className={classNames(c2.counter2, c2.guestsTeam2)}>
                    {guestsCounter} <br/>
                    {guestsTeam.name.slice(0, 5).toUpperCase()}
                </div>

                <div className={c2.homeLogo}>
                    <img src={homeTeam.logo} style={{width: '180px', height: '180px'}} alt=""/>
                </div>
                <div className={c2.guestsLogo}>
                    <img src={guestsTeam.logo} style={{width: '180px', height: '180px'}} alt=""/>
                </div>

            </div>
            }
            {props.gameData.preset === 3 &&
            <div>
            </div>
            }
            {props.gameData.preset === 4 &&
            <div className={c.tablo1}>
                <div className={c.tablo0}>TABLO</div>
            </div>
            }
            {props.gameData.preset === 5 &&
            <div className={c3.tablo3}>
                <div className={c3.teamName}>
                    {homeTeam.name} <br/>
                    {homeTeam.logo &&
                    <img src={homeTeam.logo} style={{width: '120px', height: '120px'}} alt=""/>
                    }
                </div>
                <div className={c3.gamers}>
                    {homeTeam.gamers.map(g => <div>{g.gamerNumber} {g.fullName}</div>)}
                </div>

            </div>
            }
            {props.gameData.preset === 6 &&
            <div className={c3.tablo3}>
                <div className={c3.teamName}>
                    {guestsTeam.name} <br/>
                    {guestsTeam.logo &&
                    <img src={guestsTeam.logo} style={{width: '120px', height: '120px'}} alt=""/>
                    }

                </div>
                <div className={c3.gamers}>
                    {guestsTeam.gamers.map(g => <div>{g.gamerNumber} {g.fullName}</div>)}
                </div>
            </div>
            }
            {props.gameData.preset === 7 &&
            <div className={c3.tablo3}>
                <Summary homeTeam={homeTeam} guestsTeam={guestsTeam}/>

            </div>
            }
        </div>
    )
};

export default TabloClient;
