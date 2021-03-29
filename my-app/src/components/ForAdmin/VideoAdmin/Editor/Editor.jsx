import React, {useEffect, useState} from 'react'
import c from './Editor.module.css'
import c1920 from './Editor_1920.module.css';
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import socket from "../../../../socket/socket";
import {Droppable} from 'react-drag-and-drop'
import {
    getVideoEditor,
    setCurrentVideoDataAC, setCurrentVideoEditorDataAC,
    setVideosEditorAC
} from "../../../../redux/videos_reducer";
import EditorLine from "./EditorLine";


const Editor = (props) => {

    let width = window.innerWidth;

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();


    let [dif, setDif] = useState();
    let [ping, setPing] = useState();

    let [tick, setTick] = useState(1500);
    let [count, setCount] = useState(0);


    let [isRunningServer, setIsRunningServer] = useState(false);


    let [startTime, setStartTime] = useState();

    let [timeDif, setTimeDif] = useState(0);
    let [timeMem, setTimeMem] = useState(0);

    const videosMP4 = useSelector(
        (state => state.videosPage.videosMP4)
    );

    const currentVideoStream = useSelector(
        (state => state.videosPage.currentVideoStream)
    );

    const videoEditor = useSelector(
        (state => state.videosPage.videoEditor)
    );

    let n = videoEditor.currentVideo.n;

    let deletedN = videoEditor.currentVideo.deletedN

    let allVideos = videoEditor.videos;

    let videos = allVideos.slice(deletedN, allVideos.length);


    useEffect(() => {

        videosAPI.getVideoTime(gameNumber, Date.now()).then(r => {
            setDif(r.timeData.timeSync + Math.round((Date.now() - r.timeData.dateClient) / 2));
            setPing(Math.round((Date.now() - r.timeData.dateClient) / 2));
            setIsRunningServer(r.timeData.isRunning);
            return r
        }).then(r => {
            setStartTime(r.timeData.runningTime);
            setTimeMem(r.timeData.timeMem);
            setTimeDif(r.timeData.timeMem);
        });

        dispatch(getVideoEditor(gameNumber));


        socket.on(`getVideoTime${gameNumber}`, time => {
                setIsRunningServer(time.timeData.isRunning);
                setStartTime(time.timeData.runningTime);
                setTimeMem(time.timeData.timeMem);
                setTimeDif(time.timeData.timeMem);
            }
        );

    }, []);

    useEffect(() => {

        videosAPI.getVideoTime(gameNumber, Date.now()).then(r => {

            if (Math.round((Date.now() - r.timeData.dateClient) / 2) < ping) {
                setDif(r.timeData.timeSync + Math.round((Date.now() - r.timeData.dateClient) / 2));
                setPing(Math.round((Date.now() - r.timeData.dateClient) / 2));
                setIsRunningServer(r.timeData.isRunning);
                console.log('video' + dif + ' ' + ping);
            }

            setTimeout(() => {
                setCount(count + 1);
                if (tick < 5000) {
                    setTick(tick + 50)
                }
            }, tick)
        })
    }, [count]);

    useEffect(() => {
            let interval = setInterval(() => {
                if (isRunningServer) {
                    setTimeDif(timeMem + ((Date.now() + dif) - startTime));
                }
            }, 20);
            return () => clearInterval(interval);
        }
    );


    useEffect(() => {

        socket.on(`getCurrentVideoEditor${gameNumber}`, currentVideo => {
            dispatch(setCurrentVideoEditorDataAC(currentVideo));
        });

        socket.on(`getVideosEditor${gameNumber}`, videos => {
            dispatch(setVideosEditorAC(videos));
        });

        socket.on(`getCurrentVideo`, currentVideo => {
            dispatch(setCurrentVideoDataAC(currentVideo));
        });


    }, []);


    let setCurrentVideo = (currentVideo) => {
        videosAPI.putCurrentVideo(gameNumber, currentVideo, true)
    };

    let duration = videos.map(v => v.duration).reduce((sum, current) => sum + current, 0);

    let totalDuration = videoEditor.editorData.duration;

    let deletedDuration = allVideos.slice(0, deletedN).map(v => v.duration).reduce((sum, current) => sum + current, 0);


    let scale = duration / (width === 1920 ? 1000 : 660);

    let editorStyle = {
        msWidth: (timeDif - deletedDuration) / scale
    };


    let currentDuration = totalDuration - timeDif;


    let ms = currentDuration % 1000;
    let seconds = Math.floor(currentDuration / 1000) % 60;
    let minutes = Math.floor(currentDuration / (1000 * 60));

    let duration00 = totalDuration - allVideos.slice(0, n - 1).map(v => v.duration)
        .reduce((sum, current) => sum + current, 0);

    let duration0 = totalDuration - allVideos.slice(0, n).map(v => v.duration)
        .reduce((sum, current) => sum + current, 0);

    let duration1 = totalDuration - allVideos.slice(0, n + 1).map(v => v.duration)
        .reduce((sum, current) => sum + current, 0);


    useEffect(() => {
        if (totalDuration && timeDif >= totalDuration) {
            setIsRunningServer(false);
            videosAPI.putVideoTimeStatus(gameNumber, false,
                0,
                0);

            videosAPI.clearEditorVideos(gameNumber, timeDif)

        }
    }, [totalDuration && timeDif >= totalDuration]);


    useEffect(() => {

            if ((currentDuration < duration0
                && duration1 < currentDuration)) {
                //videoSTART
                setCurrentVideo(allVideos[n])
                videosAPI.putCurrentVideoEditor(gameNumber);
            }

    }, [currentDuration < duration0, duration1 < currentDuration]);


    useEffect(() => {
        if (isRunningServer) {
            if (currentDuration < duration1) {
                videosAPI.deleteVideoFromEditor(gameNumber, 0, true)
                if (!allVideos[n + 1]) {
                    videosAPI.clearEditorVideos(gameNumber, timeDif)
                    videosAPI.resetCurrentVideo();
                }
            }
        }
    }, [currentDuration < duration1, isRunningServer]);


    const startVideo = () => {
        videosAPI.putVideoTimeStatus(gameNumber, true, timeDif,
            timeMem);
    };

    const stopVideo = () => {
        videosAPI.putVideoTimeStatus(gameNumber, false, timeMem + ((Date.now() + dif) - startTime),
            timeMem + ((Date.now() + dif) - startTime));
    };


    const clearVideo = () => {

        videosAPI.clearEditorVideos(gameNumber, timeDif).then(r => {
            if (r.resultCode === 0) {
                if (timeDif !== 0) {
                    setCurrentVideo(currentVideoStream)
                }
            }
        });

    };

    const nextVideo = () => {
        videosAPI.nextEditorVideos(gameNumber);
    };


    let onDrop = (data) => {

        let key = Object.keys(data);

        let firstKey = key[0];

        let video = videosMP4.find(d => d.videoName === data[firstKey])

        let videos = allVideos.slice()

        videos.push(video)

        videosAPI.addVideoEditor(gameNumber, videos)
    };


    return (
        <div className={c.editor}>
            <div className={width === 1920 ? c1920.title : c.title}>Редактор</div>
            <div className={width === 1920 ? c1920.editorPlayer : c.editorPlayer}>
                <div style={{display: 'inline-flex'}}>
                    <div>
                        <div style={{display: 'inline-flex'}}>
                            {allVideos.map((v, index) => index >= deletedN && <EditorLine v={v} index={index}
                                                                                          videoEditor={videoEditor}
                                                                                          scale={scale}
                                                                                          isRunningServer={isRunningServer}
                                                                                          duration={duration}
                                                                                          videos={videos}
                                                                                          isMouseDownOverDrop={props.isMouseDownOverDrop}
                                                                                          videosMP4={videosMP4}
                                                                                          deletedN={deletedN}
                                                                                          allVideos={allVideos}
                                                                                          timedif={timeDif}

                            />)}
                            <div className={width === 1920 ? c1920.editorLine : c.editorLine}
                                 style={currentDuration !== 0
                                     ? {width: editorStyle.msWidth, height: (width === 1920 ? 200 : 140)}
                                     : {display: "none"}}>
                            </div>
                        </div>
                    </div>
                    <Droppable
                        types={['video']}
                        onDrop={(e) => onDrop(e)}
                    >
                        <div className={videos.length === 0
                            ? (width === 1920 ? c1920.droppableVideoFullWidth : c.droppableVideoFullWidth)
                            : (width === 1920 ? c1920.droppableVideo : c.droppableVideo)} style={{
                            backgroundColor: props.isMouseDownOverDrop && '#defff0',
                            border: props.isMouseDownOverDrop && '2px solid'
                        }}>
                            Перетаскивать сюда из видеоматериалов
                        </div>
                    </Droppable>


                </div>
                {videos.length !== 0 &&
                <div className={width === 1920 ? c1920.playerButtons : c.playerButtons}>
                    {isRunningServer
                        ? <div style={{display: 'inline-flex'}}>
                            <div className={width === 1920 ? c1920.playerButton : c.playerButton}
                                 style={{opacity: 0.5}}>
                                Старт
                            </div>

                            <div className={width === 1920 ? c1920.playerButton : c.playerButton}
                                 onClick={(e) => stopVideo()}>
                                Стоп
                            </div>
                            <div className={width === 1920 ? c1920.playerButton : c.playerButton}
                                 onClick={(e) => clearVideo()}>
                                Очистить
                            </div>
                            <div className={width === 1920 ? c1920.playerButton : c.playerButton}
                                 onClick={(e) => nextVideo()}>
                                След. видео
                            </div>
                        </div>
                        : <div style={{display: 'inline-flex'}}>
                            <div className={width === 1920 ? c1920.playerButton : c.playerButton}
                                 onClick={(e) => startVideo()}>
                                Старт
                            </div>
                            <div className={width === 1920 ? c1920.playerButton : c.playerButton}
                                 style={{opacity: 0.5}}>
                                Стоп
                            </div>
                            <div className={width === 1920 ? c1920.playerButton : c.playerButton}
                                 onClick={(e) => clearVideo()}>
                                Очистить
                            </div>
                            <div className={width === 1920 ? c1920.playerButton : c.playerButton}
                                 style={{opacity: 0.5}}>
                                След. видео
                            </div>
                        </div>
                    }

                    <div className={c.playerTime}>
                        {minutes}:{seconds}:{ms}
                    </div>
                </div>
                }
            </div>
        </div>
    )
};

export default compose(withRouter)(Editor);
