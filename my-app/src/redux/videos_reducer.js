import {videosAPI} from "../api/api";

const SET_VIDEOS_DATA = 'videos/SET_VIDEOS_DATA';
const SET_VIDEOS_MP4_DATA = 'videos/SET_VIDEOS_MP4_DATA';
const SET_CURRENT_VIDEO_DATA = 'videos/SET_CURRENT_VIDEO_DATA';
const SET_VIDEO_EDITOR_DATA = 'videos/SET_VIDEO_EDITOR_DATA';
const SET_VIDEOS_EDITOR = 'videos/SET_VIDEOS_EDITOR';
const SET_CURRENT_VIDEO_EDITOR_DATA = 'videos/SET_CURRENT_VIDEO_EDITOR_DATA';
const IS_FETCHING = 'videos/IS_FETCHING';


let initialState = {
    videos: null,
    currentVideo: '',
    currentVideoStream: null,
    videosMP4: null,
    videoEditor: {
        editorData: {
            duration: null
        },
        currentVideo: {
            n: null,
            deletedN: null
        },
        videos: null
    },
    isFetching: 0
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
                        deletedN: action.videosData.currentVideo.deletedN
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

        case IS_FETCHING:

            return {
                ...state,
                isFetching: state.isFetching + action.isFetching
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
export const isFetchingAC = (isFetching) => ({type: IS_FETCHING, isFetching});



export const getVideos = () => async (dispatch) => {
    dispatch(isFetchingAC(1))
    let response = await videosAPI.getVideos();
    if (response.resultCode !== 10) {
        dispatch(setVideosDataAC(response));
        dispatch(isFetchingAC(-1))
    }
};
export const getVideosMP4 = () => async (dispatch) => {
    dispatch(isFetchingAC(1))
    let response = await videosAPI.getVideosMP4();
    if (response.resultCode !== 10) {
        dispatch(setVideosMP4DataAC(response));
        dispatch(isFetchingAC(-1))
    }
};


export const getCurrentVideo = () => async (dispatch) => {
    dispatch(isFetchingAC(1))
    let response = await videosAPI.getCurrentVideo();
    if (response.resultCode !== 10) {
        dispatch(setCurrentVideoDataAC(response));
        dispatch(isFetchingAC(-1))
    }
};

export const getVideoEditor = (gameNumber) => async (dispatch) => {
    dispatch(isFetchingAC(1))
    let response = await videosAPI.getVideoEditor(gameNumber);
    if (response.resultCode !== 10) {
        dispatch(setVideoEditorDataAC(response));
        dispatch(isFetchingAC(-1))
    }
};


export default videosReducer;
