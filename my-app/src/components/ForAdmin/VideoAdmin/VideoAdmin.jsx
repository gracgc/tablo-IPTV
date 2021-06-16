import React, {useState} from 'react'
import c from './VideoAdmin.module.css'
import TabloEdit from "../AdminPanel/TabloEdit/TabloEdit";
import Info from "../AdminPanel/Info/Info";
import {compose} from "redux";
import {NavLink, withRouter} from "react-router-dom";
import Presets from "./Presets/Presets";
import Cameras from "./Cameras/Cameras";
import VideosMP4 from "./Videos/VideosMP4";
import Editor from "./Editor/Editor";
import {Droppable} from "react-drag-and-drop";


const VideoAdmin = (props) => {

    let [isMouseDownOverDrop, setIsMouseDownOverDrop] = useState(false)

    let [isSwitch, setIsSwitch] = useState(false)


    let onDrop = (data) => {
        setIsMouseDownOverDrop(false)
    };


    return (
        <div className={c.videoAdmin}>
            <Droppable
                types={['video']}
                onDrop={(e) => onDrop(e)}
            >
                <div className={c.videoAdmin__info}>
                    <Info gameData={props.gameData}/>
                </div>
                <div className={c.videoAdmin__editor}>
                    <div>
                        <Editor isMouseDownOverDrop={isMouseDownOverDrop} videoEditor={props.videoEditor}
                                videosMP4={props.videosMP4} currentVideoStream={props.currentVideoStream}/>
                    </div>
                    <div>
                        <TabloEdit isSwitch={isSwitch} setIsSwitch={setIsSwitch} teams={props.teams}/>
                    </div>
                </div>
                <div className={c.videoAdmin__presetsAndVideos}>
                    <div>
                        <VideosMP4 setIsMouseDownOverDrop={setIsMouseDownOverDrop} videosMP4={props.videosMP4}/>
                    </div>
                    <div>
                        <Presets gameData={props.gameData}/>
                    </div>
                </div>
                <div className={c.videoAdmin__camera}>
                    <div>
                        <Cameras videos={props.videos} currentVideoStream={props.currentVideoStream}/>
                    </div>
                </div>
            </Droppable>
        </div>
    )
};

export default compose(withRouter)(VideoAdmin);
