import React, {useEffect, useState} from 'react'
import c from './Cameras.module.css'
import c1920 from './Cameras_1920.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";
import {useDispatch, useSelector} from "react-redux";
import {setPresetAC} from "../../../../redux/games_reducer";
import socket from "../../../../socket/socket";
import {getCurrentVideo, getVideos, setVideosDataAC} from "../../../../redux/videos_reducer";
import {Field, reduxForm, reset} from "redux-form";
import {Input} from "../../../../common/FormsControls/FormsControls";
import {requiredShort} from "../../../../utils/validators";
import ReactHlsPlayer from "react-hls-player";
import Camera from "./Camera";


const AddCamera = (props) => {

    let width = window.innerWidth;

    return (
        <div className={width === 1920 ? c1920.addCameraForm : c.addCameraForm}>
            <div className={width === 1920 ? c1920.exitForm : c.exitForm} onClick={e => props.setShowAddCameraForm(false)}>
                ✘
            </div>
            <form onSubmit={props.handleSubmit}>
                <div className={width === 1920 ? c1920.cameraForm : c.cameraForm}>
                    <Field placeholder={'Название потока'} name={'addCameraName'}
                           validate={[requiredShort]}
                           component={Input}/>
                    <Field placeholder={'URL потока'} name={'addCameraURL'}
                           validate={[requiredShort]}
                           component={Input}/>
                    <button className={width === 1920 ? c1920.addCameraButton : c.addCameraButton}>
                        Добавить
                    </button>
                </div>
            </form>
        </div>
    )
};

const AddCameraReduxForm = reduxForm({form: 'addCamera'})(AddCamera);

const Cameras = (props) => {

    let width = window.innerWidth;

    let gameNumber = props.match.params.gameNumber;

    const dispatch = useDispatch();

    const [paginatorN, setPaginatorN] = useState(0);

    const paginatorScale = 4;


    let videos = useSelector(
        (state => state.videosPage.videos)
    );

    let currentVideoStream = useSelector(
        (state => state.videosPage.currentVideoStream)
    );




    useEffect(() => {
        dispatch(getVideos());
        dispatch(getCurrentVideo());

        socket.on(`getPreset${gameNumber}`, preset => {
            dispatch(setPresetAC(preset))
        });


        socket.on(`getVideos`, videos => {
                dispatch(setVideosDataAC(videos))
            }
        );


    }, []);

    let changePaginatorN = (symbol) => {
        if (symbol === '+')
            setPaginatorN(paginatorN + 1);
        if (symbol === '-') {
            setPaginatorN(paginatorN - 1)
        }
    };

    let setCurrentVideo = (currentVideo) => {
        videosAPI.putCurrentVideo(gameNumber, currentVideo, false);
    };

    const onSubmit = (formData) => {
        if (formData.addCameraURL !== undefined) {
            videosAPI.addVideo(
                formData.addCameraName,
                formData.addCameraURL
            );
            dispatch(reset('addCamera'));
            setShowAddCameraForm(false)
        }
    };

    const [showAddCameraForm, setShowAddCameraForm] = useState(false);

    return (
        <div className={width === 1920 ? c1920.camerasBlock : c.camerasBlock}>
            <div className={width === 1920 ? c1920.title : c.title}>Камеры</div>
            <div style={{display: 'inline-flex'}}>
                <div className={width === 1920 ? c1920.addButton : c.addButton} onClick={e => setShowAddCameraForm(true)}>
                    +
                </div>
                {paginatorN > 0 ?
                    <div className={width === 1920 ? c1920.paginator : c.paginator} onClick={(e) => {
                        changePaginatorN('-')
                    }}>
                        ←
                    </div> :
                    <div className={width === 1920 ? c1920.paginator : c.paginator} style={{opacity: '0.5'}}>
                        ←
                    </div>
                }
                <div className={width === 1920 ? c1920.cameras : c.cameras}>
                    {videos.slice(paginatorScale * paginatorN, paginatorScale + paginatorScale * paginatorN)
                        .map((v, index) =>
                            <Camera v={v} index={index} paginatorForIndex={paginatorN * paginatorScale} currentVideoStream={currentVideoStream} setCurrentVideo={setCurrentVideo}/>
                        )}
                </div>
                {videos.slice(paginatorScale * (paginatorN + 1), paginatorScale + paginatorScale * (paginatorN + 1)).length !== 0 ?
                    <div className={width === 1920 ? c1920.paginator : c.paginator} onClick={(e) => {
                        changePaginatorN('+')
                    }}>
                        →
                    </div> :
                    <div className={width === 1920 ? c1920.paginator : c.paginator} style={{opacity: '0.5'}}>
                        →
                    </div>}
            </div>

            {showAddCameraForm && <AddCameraReduxForm onSubmit={onSubmit} setShowAddCameraForm={setShowAddCameraForm}/>}
        </div>
    )
};

export default compose(withRouter)(Cameras);
