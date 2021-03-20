import React, {useEffect, useState} from 'react'
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


const STB = (props) => {


    const currentVideo = useSelector(
        (state => state.videosPage.currentVideo)
    );

    const videoEditor = useSelector(
        (state => state.videosPage.videoEditor)
    );

    const dispatch = useDispatch();


    let [pad, setPad] = useState();

    let padding = videoEditor.currentVideo.padding;


    useEffect(() => {
        dispatch(getCurrentVideo());
        dispatch(getVideoEditor(props.gameNumber))
    }, [props.gameNumber]);

    useEffect(() => {

        socket.on(`getCurrentVideoEditor${props.gameNumber}`, currentVideo => {
            dispatch(setCurrentVideoEditorDataAC(currentVideo));
        });

        socket.on(`getCurrentVideo`, currentVideo => {
            dispatch(setCurrentVideoDataAC(currentVideo));
            console.log(currentVideo)
        });


    }, []);

    let player = window.TvipPlayer;

    useEffect(() => {
        socket.on(`getPlayerStatus`, isRunning => {

            if (player) {
                if (isRunning) {
                    player.unpause();
                } else {
                    player.pause();
                }
            }
        });
    }, [player])


    useEffect(() => {
        if (player) {
            setTimeout(() => {
                player.unpause();
            }, 2000)
        }
    }, [])


    useEffect(() => {
        if (player) {
            player.playUrl(currentVideo.videoURL, '');
            player.pause();
        }
    }, [player, currentVideo]);



    useEffect(() => {
        if (padding) {
            setPad('Переход');
        } else {
            setPad('');
            if (player) {
                player.unpause()
            }
        }
    }, [padding]);


    return (
        <div className={c.stb}>
            <div style={{textAlign: 'center', position: 'absolute', left: '30px', color: 'green'}}>{pad}</div>
        </div>
    )
};

export default compose(withRouter)(STB);
