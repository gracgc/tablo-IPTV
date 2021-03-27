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

    // if (window.stb) {
    //     window.stb.play('http://test_stream.iptvportal.cloud/karusel/mono.m3u8?token=ares')
    //
    // }




    useEffect(() => {
        socket.on(`getPlayerStatus`, isRunning => {

            if (player) {
                if (isRunning) {
                    player.unpause();
                    // stb.continue()
                } else {
                    player.pause();
                    // stb.pause()
                }
            }
            // if (stb) {
            //     if (isRunning) {
            //         stb.continue()
            //     } else {
            //         stb.pause()
            //     }
            // }
        });
    }, [player])


    useEffect(() => {
        if (player) {
            setTimeout(() => {
                player.unpause();
            }, 2000)
        }
        // if (window.stb) {
        //     setTimeout(() => {
        //         window.stb.continue()
        //     }, 2000)
        // }
    }, [])


    useEffect(() => {
        if (window.stb) {
            window.stb.play(currentVideo.videoURL)
            window.stb.stb.pause()
        }
    }, [currentVideo]);

    useEffect(() => {
        if (window.stb) {
            window.stb.play(currentVideo.videoURL)
            window.stb.stb.pause()
        }
    }, [currentVideo]);



    useEffect(() => {
        if (padding) {
            setPad('Переход');
        } else {
            setPad('');
            if (player) {
                player.unpause()
            }
            // if (stb) {
            //     stb.continue()
            // }
        }
    }, [padding]);


    return (
        <div className={c.stb}>
            <div style={{textAlign: 'center', position: 'absolute', left: '30px', color: 'green'}}>{pad}</div>
        </div>
    )
};

export default compose(withRouter)(STB);
