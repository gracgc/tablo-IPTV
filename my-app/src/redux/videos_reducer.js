import {videosAPI} from "../api/api";

const SET_VIDEOS_DATA = 'videos/SET_VIDEOS_DATA';
const SET_VIDEOS_MP4_DATA = 'videos/SET_VIDEOS_MP4_DATA';
const SET_CURRENT_VIDEO_DATA = 'videos/SET_CURRENT_VIDEO_DATA';
const SET_VIDEO_EDITOR_DATA = 'videos/SET_VIDEO_EDITOR_DATA';
const SET_VIDEOS_EDITOR = 'videos/SET_VIDEOS_EDITOR';
const SET_CURRENT_VIDEO_EDITOR_DATA = 'video/SET_CURRENT_VIDEO_EDITOR_DATA';


let initialState = {
    videos: [
        {
            videoName: "ВИДЕО",
            videoURL: "",
            videoType: ""
        }
    ],
    currentVideo: {
        videoName: "ВИДЕО",
        videoURL: "",
        videoType: ""
    },
    currentVideoStream: {
        videoName: "ВИДЕО",
        videoURL: "",
        videoType: ""
    },
    videosMP4: [
        {
            videoName: "ВИДЕО",
            videoURL: "",
            duration: 0
        }
    ],
    videoEditor: {
        editorData: {
            duration: 0
        },
        currentVideo: {
            n: 1,
            deletedN: 0
        },
        videos: [
            {
                videoName: "ВИДЕО",
                videoURL: "",
                videoType: "",
                duration: 10
            }
        ]
    }
};

const videosReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_VIDEOS_DATA:

            return {
                ...state,
                videos: action.videosData
            };

        case SET_VIDEOS_MP4_DATA:

            return {
                ...state,
                videosMP4: action.videosData
            };

        case SET_CURRENT_VIDEO_DATA:
            if (action.currentVideo.currentVideo === null) {
                return {
                    ...state,
                    currentVideoStream: action.currentVideo.currentVideoStream
                };
            } else {
                return {
                    ...state,
                    currentVideo: action.currentVideo.currentVideo,
                    currentVideoStream: action.currentVideo.currentVideoStream
                };
            }



        case SET_VIDEO_EDITOR_DATA:

            return {
                ...state,
                videoEditor: {
                    ...state.videoEditor,
                    videos: action.videosData.videos,
                    editorData: {
                        ...state.videoEditor.editorData, duration: action.videosData.videos.map(v => v.duration)
                            .reduce((sum, current) => sum + current, 0)
                    },
                    currentVideo: {
                        ...state.videoEditor.currentVideo, n: action.videosData.currentVideo.n,
                        deletedN: action.videosData.currentVideo.deleted
                    }
                },
            };


        case SET_VIDEOS_EDITOR:

            return {
                ...state,
                videoEditor: {
                    ...state.videoEditor,
                    videos: action.videos,
                    editorData: {
                        ...state.videoEditor.editorData, duration: action.videos.map(v => v.duration)
                            .reduce((sum, current) => sum + current, 0)
                    }
                }
            };

        case SET_CURRENT_VIDEO_EDITOR_DATA:

            return {
                ...state,
                videoEditor: {
                    ...state.videoEditor,
                    currentVideo: action.currentVideo
                }
            };


        default:
            return state;
    }
};

export const setVideosDataAC = (videosData) => ({type: SET_VIDEOS_DATA, videosData});
export const setVideosMP4DataAC = (videosData) => ({type: SET_VIDEOS_MP4_DATA, videosData});
export const setCurrentVideoDataAC = (currentVideo) => ({type: SET_CURRENT_VIDEO_DATA, currentVideo});
export const setVideoEditorDataAC = (videosData) => ({type: SET_VIDEO_EDITOR_DATA, videosData});
export const setVideosEditorAC = (videos) => ({type: SET_VIDEOS_EDITOR, videos});
export const setCurrentVideoEditorDataAC = (currentVideo) => ({type: SET_CURRENT_VIDEO_EDITOR_DATA, currentVideo});



export const getVideos = () => async (dispatch) => {
    let response = await videosAPI.getVideos();
    if (response.resultCode !== 10) {
        dispatch(setVideosDataAC(response));
    }
};
export const getVideosMP4 = () => async (dispatch) => {
    let response = await videosAPI.getVideosMP4();
    if (response.resultCode !== 10) {
        dispatch(setVideosMP4DataAC(response));
    }
};


export const getCurrentVideo = () => async (dispatch) => {
    let response = await videosAPI.getCurrentVideo();
    if (response.resultCode !== 10) {
        dispatch(setCurrentVideoDataAC(response));
    }
};

export const getVideoEditor = (gameNumber) => async (dispatch) => {
    let response = await videosAPI.getVideoEditor(gameNumber);
    if (response.resultCode !== 10) {
        dispatch(setVideoEditorDataAC(response));
    }
};


export default videosReducer;
