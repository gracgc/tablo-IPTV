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


    const dispatch = useDispatch();





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

    let stb = window.stb;


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
    }, [])


    useEffect(() => {
        socket.on(`getPlayerStatus`, isRunning => {

            if (stb) {
                if (isRunning) {
                    stb.continuePlay()
                } else {
                    stb.pause()
                }
            }
        });
    }, [])

    useEffect(() => {
        if (player) {
            player.playUrl(currentVideo.videoURL, '');
        }
    }, [currentVideo]);



    useEffect(() => {
        if (stb && currentVideo.videoURL !== '') {
            stb.play(currentVideo.videoURL)
        }
    }, [currentVideo]);





    return (
        <div className={c.stb}>

        </div>
    )
};

export default compose(withRouter)(STB);
