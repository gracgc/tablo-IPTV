import React, {useEffect, useState} from 'react';
import c from './VideosMP4.module.css';
import c1920 from './VideosMP4_1920.module.css';
import classNames from 'classnames';
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import socket from "../../../../socket/socket";
import {
    getVideosMP4,
    setVideosMP4DataAC
} from "../../../../redux/videos_reducer";
import {Field, reduxForm, reset, stopSubmit} from "redux-form";
import {Input} from "../../../../common/FormsControls/FormsControls";
import Button from "@material-ui/core/Button";
import * as axios from "axios";
import {maxTime60, requiredShort} from "../../../../utils/validators";
import VideoMP4 from "./VideoMP4";


const AddVideoMP4 = (props) => {

    let width = window.innerWidth;


    return (

        <div className={width === 1920 ? c1920.addVideoForm : c.addVideoForm}>
            <div className={width === 1920 ? c1920.exitForm : c.exitForm}
                 onClick={e => props.setShowAddVideoForm(false)}>
                ✘
            </div>
            <form onSubmit={props.handleSubmit}>
                <div className={width === 1920 ? c1920.videoForm : c.videoForm}>
                    <Field placeholder={'Название видео'} name={'videoName'}
                           validate={[requiredShort]}
                           component={Input}/>
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Загрузить видео
                        <input
                            name="videoMP4"
                            type="file"
                            accept=".mp4"
                            hidden
                            onChange={(e) => props.setVideoMP4(e.target.files[0])}
                        />
                    </Button>
                </div>
                <button className={width === 1920 ? c1920.addVideoButton : c.addVideoButton}>
                    Добавить
                </button>
                {!props.videoMP4 ? <span style={{marginLeft: 10, color: 'red', fontSize: 20}}>Видео не загружено</span>
                    : <span style={{marginLeft: 10, color: 'green', fontSize: 20}}>Видео загружено</span>}
            </form>
        </div>


    )
};

const AddVideoReduxForm = reduxForm({form: 'addVideo'})(AddVideoMP4);

const VideosMP4 = (props) => {

    let width = window.innerWidth;

    const dispatch = useDispatch();

    const [paginatorN, setPaginatorN] = useState(0);

    const paginatorScale = 4;


    let [videoMP4, setVideoMP4] = useState();

    const [showAddVideoForm, setShowAddVideoForm] = useState(false);


    useEffect(() => {

        socket.on(`getVideosMP4`, videos => {
            dispatch(setVideosMP4DataAC(videos));
        });

    }, []);


    let uploadVideo = (videoName) => {

        let videoFormData = new FormData;

        videoFormData.append('file', videoMP4);


        axios.post(`/api/videos/mp4/${videoName}`, videoFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

    };

    let changePaginatorN = (symbol) => {
        if (symbol === '+')
            setPaginatorN(paginatorN + 1);
        if (symbol === '-') {
            setPaginatorN(paginatorN - 1)
        }
    };

    const onSubmit = (formData) => {
        let sameName = props.videosMP4.find(v => v.videoName === formData.videoName)
        if (videoMP4 && !sameName) {
            uploadVideo(formData.videoName);
            dispatch(reset('addVideo'));
            setShowAddVideoForm(false)
        } else {
            dispatch(stopSubmit('addVideo', {videoName: 'Такое название уже есть'}))
        }

    };


    return (
        <div className={width === 1920 ? c1920.camerasBlock : c.camerasBlock}>
            <div className={width === 1920 ? c1920.title : c.title}>Видеоматериалы</div>
            <div style={{display: 'inline-flex'}}>
                <div className={width === 1920 ? c1920.addButton : c.addButton}
                     onClick={e => setShowAddVideoForm(true)}>
                    +
                </div>
                {props.videosMP4.length !== 0 && <div style={{display: 'inline-flex'}}>
                    {paginatorN > 0 ?
                        <div className={width === 1920 ? classNames(c1920.paginator, c1920.active) : classNames(c.paginator, c.active)} onClick={(e) => {
                            changePaginatorN('-')
                        }}>
                            ←
                        </div> :
                        <div className={width === 1920 ? classNames(c1920.paginator, c1920.disable) : classNames(c.paginator, c.disable)}>
                            ←
                        </div>
                    }
                    <div className={width === 1920 ? c1920.videos : c.videos}>
                        {props.videosMP4.slice(paginatorScale * paginatorN, paginatorScale + paginatorScale * paginatorN)
                            .map((v, index) =>
                                <VideoMP4 v={v} index={index} setIsMouseDownOverDrop={props.setIsMouseDownOverDrop}
                                          paginatorForIndex={paginatorN * paginatorScale}/>
                            )}
                    </div>
                    {props.videosMP4.slice(paginatorScale * (paginatorN + 1), paginatorScale + paginatorScale * (paginatorN + 1)).length !== 0 ?
                        <div className={width === 1920 ? classNames(c1920.paginator, c1920.active) : classNames(c.paginator, c.active)} onClick={(e) => {
                            changePaginatorN('+')
                        }}>
                            →
                        </div> :
                        <div className={width === 1920 ? classNames(c1920.paginator, c1920.disable) : classNames(c.paginator, c.disable)}>
                            →
                        </div>}
                </div>}
            </div>
            {showAddVideoForm && <AddVideoReduxForm onSubmit={onSubmit} setShowAddVideoForm={setShowAddVideoForm}
                                                    videoMP4={videoMP4} setVideoMP4={setVideoMP4} videosMP4={props.videosMP4}/>}

        </div>
    )
};

export default compose(withRouter)(VideosMP4);