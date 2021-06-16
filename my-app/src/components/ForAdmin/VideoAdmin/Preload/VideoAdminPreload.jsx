import React, {useEffect} from 'react'
import {compose} from "redux";
import {withRouter} from "react-router-dom";
import VideoAdmin from "../VideoAdmin";
import {getCurrentVideo, getVideoEditor, getVideos, getVideosMP4} from "../../../../redux/videos_reducer";
import {useDispatch, useSelector} from "react-redux";
import {getGame} from "../../../../redux/games_reducer";
import Loading from "../../../Loading/Loading";
import {getTeams} from "../../../../redux/teams_reducer";



const VideoAdminPreload = (props) => {

    const dispatch = useDispatch();

    let gameNumber = props.match.params.gameNumber;


    let videos = useSelector(
        (state => state.videosPage.videos)
    );

    const videosMP4 = useSelector(
        (state => state.videosPage.videosMP4)
    );

    const currentVideoStream = useSelector(
        (state => state.videosPage.currentVideoStream)
    );

    const videoEditor = useSelector(
        (state => state.videosPage.videoEditor)
    );


    const gameData = useSelector(
        state => state.gamesPage.gameData
    );

    const teams = useSelector(
        state => state.teamsPage.teams
    );

    const isFetchingGame = useSelector(
        state => state.gamesPage.isFetching
    );

    const isFetchingVideos = useSelector(
        state => state.videosPage.isFetching
    );

    const isFetchingTeams = useSelector(
        state => state.teamsPage.isFetching
    );


    useEffect(() => {
        dispatch(getVideos());
        dispatch(getVideosMP4());
        dispatch(getCurrentVideo());
        dispatch(getVideoEditor(gameNumber));
        dispatch(getGame(gameNumber));
        dispatch(getTeams(gameNumber));
    }, [])


    return (
        <div>
            {(isFetchingGame !== 0 || isFetchingVideos !== 0 || isFetchingTeams !== 0)
                ? <Loading/>
                : videosMP4 && gameData && teams && <VideoAdmin videos={videos} videosMP4={videosMP4}
                                                   currentVideoStream={currentVideoStream}
                                                   videoEditor={videoEditor} gameData={gameData} teams={teams}/>
            }

        </div>
    )
};

export default compose(withRouter)(VideoAdminPreload);
