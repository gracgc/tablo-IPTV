import React, {useEffect, useState} from 'react'
import c from './Cameras.module.css'
import c1920 from './Cameras_1920.module.css'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import {videosAPI} from "../../../../api/api";


const Camera = (props) => {

    let width = window.innerWidth;

    const [showDeleteButton, setShowDeleteButton] = useState(false);

    let deleteVideoFromList = (index) => {
        videosAPI.deleteVideo(index + props.paginatorForIndex)
    };


    return (


            <div className={width === 1920 ? c1920.camera : c.camera}
                 style={{border: props.currentVideoStream.videoURL === props.v.videoURL && 'forestgreen 4px solid',
                     backgroundColor: props.currentVideoStream.videoURL === props.v.videoURL     && 'darkcyan'}}
                 onMouseOver={(e) => setShowDeleteButton(true)}
                 onMouseLeave={(e) => setShowDeleteButton(false)}
                 onClick={(e) => props.setCurrentVideo(props.v)}>
                <div>
                    {/*<ReactHlsPlayer*/}
                    {/*    url={props.v.videoURL}*/}
                    {/*    autoplay={false}*/}
                    {/*    muted={true}*/}
                    {/*    controls={false}*/}
                    {/*    width={170}*/}
                    {/*/>*/}
                </div>

                <div>
                    {props.v.videoName}
                </div>

                {showDeleteButton && props.currentVideoStream.videoURL !== props.v.videoURL &&
                <div className={width === 1920 ? c1920.deleteVideo : c.deleteVideo} onClick={e => deleteVideoFromList(props.index)}>
                    ✘
                </div>
                }
            </div>





    )
};

export default compose(withRouter)(Camera);
