import React, {useState} from 'react'
import c from './Editor.module.css'
import c1920 from './Editor_1920.module.css';
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";
import {Droppable} from 'react-drag-and-drop'


const EditorLine = (props) => {

    let width = window.innerWidth;

    let gameNumber = props.match.params.gameNumber;


    const [showDeleteButton, setShowDeleteButton] = useState(false);

    let deleteVideoFromEditor = (index) => {
        videosAPI.deleteVideoFromEditor(gameNumber, index, false)
    };

    let isDroppable = props.isMouseDownOverDrop

    let onDrop = (data) => {

        if (isDroppable) {

            let key = Object.keys(data);

            let firstKey = key[0];

            let video = props.videosMP4.find(d => d.videoName === data[firstKey])

            let videos = props.allVideos.slice()

            videos.splice(
                props.index + 1,
                0,
                video
            )


            videosAPI.addVideoEditor(gameNumber, videos)

        }
    };


    return (
        <div style={{display: 'inline-flex'}}>
            <Droppable
                types={['video']}
                onDrop={(e) => onDrop(e)}
            >
                <div className={width === 1920 ? c1920.video : c.video}
                     style={props.videoEditor.editorData.duration !== 0
                         ? {
                             width: props.v.duration / props.scale,
                             opacity: isDroppable && 1.0,
                             backgroundColor: isDroppable && '#defff0'
                         }
                         : {display: "none"}}
                     onMouseOver={(e) => setShowDeleteButton(true)}
                     onMouseLeave={(e) => setShowDeleteButton(false)}>
                    <div>
                        {props.v.videoName.slice(0, 4)}
                        {props.v.videoName.length > 4 && '.'}
                    </div>

                    {width === 1920
                        ? <video src={props.v.videoURL} style={props.v.duration / props.scale < 200
                            ? {width: props.v.duration / props.scale, margin: 'auto'}
                            : {width: 200, margin: 'auto'}}/>
                        : <video src={props.v.videoURL} style={props.v.duration / props.scale < 155
                            ? {width: props.v.duration / props.scale, margin: 'auto'}
                            : {width: 155, margin: 'auto'}}/>
                    }

                    {showDeleteButton
                    && (props.index !== props.deletedN || props.timedif === 0)

                        ? <div className={width === 1920 ? c1920.exitForm : c.exitForm}
                               onClick={e => deleteVideoFromEditor(props.index)}>
                            Удалить
                        </div>
                        :
                        <div>

                        </div>
                    }
                </div>
            </Droppable>
        </div>
    )
};

export default compose(withRouter)(EditorLine);
