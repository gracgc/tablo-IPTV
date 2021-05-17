const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const authMW = require('../middleware/authMW');
const {getVideoDurationInSeconds} = require('get-video-duration');
const cyrillicToTranslit = require('cyrillic-to-translit-js');
const config = require('config');

let port = config.get('port')

let stadiums = config.get('stadiums')

let getHost = (host) => {
    return host.split(':')[0]
}

let getStadium = (host) => {
    if (stadiums[host]) {
        return stadiums[host]
    } else {
        return stadiums['default']
    }
}


router.get('/', function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`));
        let DB = JSON.parse(data);


        res.send(DB.videos)


    } catch (e) {
        console.log(e)
    }
});


router.post('/', authMW, cors(), async function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let videoName = req.body.videoName;
        let videoURL = req.body.videoURL;


        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`));
        let DB = JSON.parse(data);

        DB.videos.push({
            videoName: videoName,
            videoURL: videoURL
        });

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.to(stadium).emit(`getVideos`, DB.videos)

    } catch (e) {
        console.log(e)
    }
});


router.put('/delete', authMW, cors(), async function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let index = req.body.index;


        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`));
        let DB = JSON.parse(data);

        DB.videos.splice(index, 1)

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.to(stadium).emit(`getVideos`, DB.videos)

    } catch (e) {
        console.log(e)
    }
});


router.get('/editor/:gameNumber', function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/video_${gameNumber}.json`));
        let DB = JSON.parse(data);


        res.send(DB)


    } catch (e) {
        console.log(e)
    }
});


router.post('/editor/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let gameNumber = req.params.gameNumber;

        let videos = req.body.videos;

        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/video_${gameNumber}.json`));

        let DB = JSON.parse(data);


        DB.videos = videos

        const io = req.app.locals.io;

        io.to(stadium).emit(`getVideosEditor${gameNumber}`, DB.videos)

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/video_${gameNumber}.json`), json, 'utf8')

        res.send({resultCode: 0});

    } catch (e) {
        console.log(e)
    }
});


router.put('/editor/current/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let gameNumber = req.params.gameNumber;


        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/video_${gameNumber}.json`));
        let DB = JSON.parse(data);


        DB.currentVideo.n += 1;


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;


        io.to(stadium).emit(`getCurrentVideoEditor${gameNumber}`, DB.currentVideo)

    } catch (e) {
        console.log(e)
    }
});


router.put('/editor/delete/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let gameNumber = req.params.gameNumber;

        let index = req.body.index;

        let isAuto = req.body.isAuto;


        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/video_${gameNumber}.json`));
        let DB = JSON.parse(data);


        if (isAuto) {
            DB.currentVideo.deletedN += 1
        } else {
            DB.videos.splice(index, 1);
        }

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.to(stadium).emit(`getVideosEditor${gameNumber}`, DB.videos)

        io.to(stadium).emit(`getCurrentVideoEditor${gameNumber}`, DB.currentVideo)

    } catch (e) {
        console.log(e)
    }
});


router.put('/editor/clear/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        const io = req.app.locals.io;

        let gameNumber = req.params.gameNumber;


        let DB = {
            currentVideo: {
                n: 0,
                deletedN: 0
            },
            timeData: {
                timeMem: 0,
                timeDif: 0,
                isRunning: false,
                runningTime: Date.now()
            },
            videos: []
        }


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        io.to(stadium).emit(`getVideoTime${gameNumber}`, DB);

        io.to(stadium).emit(`getVideosEditor${gameNumber}`, []);

        io.to(stadium).emit(`getCurrentVideoEditor${gameNumber}`, DB.currentVideo)


    } catch (e) {
        console.log(e)
    }
});

router.put('/editor/nextVideo/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        const io = req.app.locals.io;

        let gameNumber = req.params.gameNumber;


        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/video_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let n = DB.currentVideo.n;

        let cut = DB.videos.slice(0, n).map(v => v.duration)
            .reduce((sum, current) => sum + current, 0)

        DB.timeData.timeDif = cut - 200;
        DB.timeData.timeMem = cut - 200;

        DB.timeData.runningTime = Date.now();


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        io.to(stadium).emit(`getVideoTime${gameNumber}`, DB);

    } catch (e) {
        console.log(e)
    }
});


router.get('/current', function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`));
        let DB = JSON.parse(data);

        res.send({currentVideo: DB.currentVideo, currentVideoStream: DB.currentVideoStream})

    } catch (e) {
        console.log(e)
    }
});


router.put('/current/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        const io = req.app.locals.io;

        let gameNumber = req.params.gameNumber;

        let currentVideo = req.body.currentVideo;

        let isEditor = req.body.isEditor;

        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`));
        let DB = JSON.parse(data);

        let data2 = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/video_${gameNumber}.json`));
        let DB2 = JSON.parse(data2);


        if (!DB2.timeData.isRunning && DB2.timeData.timeMem === 0) {
            DB.currentVideo = currentVideo;
            DB.currentVideoStream = currentVideo;


            let json = JSON.stringify(DB);

            fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`), json, 'utf8');

            io.to(stadium).emit(`getCurrentVideo`, {currentVideo: DB.currentVideo, currentVideoStream: DB.currentVideoStream});

            if (!currentVideo.duration) {
                DB.currentVideoStream = currentVideo;
            }
        } else {
            if (isEditor) {
                DB.currentVideo = currentVideo;

                let json = JSON.stringify(DB);

                fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`), json, 'utf8');

                io.to(stadium).emit(`getCurrentVideo`, {currentVideo: DB.currentVideo, currentVideoStream: DB.currentVideoStream})

            } else {

                if (!currentVideo.duration) {
                    DB.currentVideoStream = currentVideo;

                    let json = JSON.stringify(DB);

                    fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`), json, 'utf8');

                    io.to(stadium).emit(`getCurrentVideo`, {currentVideo: null, currentVideoStream: DB.currentVideoStream})

                }
            }
        }


        res.send({resultCode: 0});


    } catch (e) {
        console.log(e)
    }
});


router.put('/reset', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`));
        let DB = JSON.parse(data);


        DB.currentVideo = DB.currentVideoStream;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videos.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.to(stadium).emit(`getCurrentVideo`, {currentVideo: DB.currentVideo, currentVideoStream: DB.currentVideoStream})

    } catch (e) {
        console.log(e)
    }
});


router.get('/mp4', cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)



        let dataLocal = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videosMP4_local.json`));
        let DBLocal = JSON.parse(dataLocal);

        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videosMP4.json`));
        let DB = JSON.parse(data);


        if (config.get('port') === 5000) {
            res.send(DBLocal.videos)
        } else {
            res.send(DB.videos)
        }


    } catch (e) {
        console.log(e)
    }
});


router.get('/mp4/:videoName', cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let videoName = req.params.videoName;

        let video = path.join(__dirname + `/DBs/DB_${stadium}/videosMP4/${videoName}.mp4`);

        res.sendFile(video);

    } catch (e) {
        console.log(e)
    }
});


router.post('/mp4/:videoName', cors(), async function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)



        const io = req.app.locals.io;

        let videoName = req.params.videoName;

        let videoNameSplit = videoName.split(' ').join('_')



        let video = req.files.file;

        let videoNameEN = cyrillicToTranslit().transform(videoNameSplit);

        video.name = `${videoNameEN}.mp4`;

        await video.mv(`${__dirname}/DBs/DB_${stadium}/videosMP4/${videoNameEN}.mp4`);


        getVideoDurationInSeconds(`http://${req.get('host')}/api/videos/mp4/${videoNameEN}`).then((duration) => {


                if (config.get('port') === 5000) {
                    let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videosMP4_local.json`));
                    let DB = JSON.parse(data);

                    DB.videos.push({
                        videoName: videoName,
                        videoURL: `http://${req.get('host')}/api/videos/mp4/${videoNameEN}`,
                        duration: duration * 1000
                    });

                    let json = JSON.stringify(DB);

                    fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videosMP4_local.json`), json, 'utf8');


                    io.to(stadium).emit(`getVideosMP4`, DB.videos);

                    res.send({resultCode: 0});

                } else {
                    let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videosMP4.json`));
                    let DB = JSON.parse(data);

                    DB.videos.push({
                        videoName: videoName,
                        videoURL: `http://${req.get('host')}/api/videos/mp4/${videoNameEN}`,
                        duration: duration * 1000
                    });


                    let json = JSON.stringify(DB);

                    fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videosMP4.json`), json, 'utf8');


                    io.to(stadium).emit(`getVideosMP4`, DB.videos);

                    res.send({resultCode: 0});
                }
            }
        )


    } catch (e) {
        console.log(e)
    }
});


router.put('/mp4/delete', authMW, cors(), async function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)



        const io = req.app.locals.io;

        let index = req.body.index;

        let videoName = req.body.videoName;

        let videoNameSplit = videoName.split(' ').join('_')

        let videoNameEN = cyrillicToTranslit().transform(videoNameSplit);


        fs.unlinkSync(path.join(__dirname +
            `/DBs/DB_${stadium}/videosMP4/${videoNameEN}.mp4`));


        if (config.get('port') === 5000) {
            let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videosMP4_local.json`));
            let DB = JSON.parse(data);

            DB.videos.splice(index, 1)

            let json = JSON.stringify(DB);

            fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videosMP4_local.json`), json, 'utf8');


            io.to(stadium).emit(`getVideosMP4`, DB.videos);

            res.send({resultCode: 0});

        } else {
            let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videosMP4.json`));
            let DB = JSON.parse(data);

            DB.videos.splice(index, 1)


            let json = JSON.stringify(DB);

            fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/videosMP4.json`), json, 'utf8');


            io.to(stadium).emit(`getVideosMP4`, DB.videos);

            res.send({resultCode: 0});
        }


    } catch (e) {
        console.log(e)
    }
});


router.post('/sync/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let dateClient = req.body.dateClient;

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/video_${gameNumber}.json`));
        let DB = JSON.parse(data);

        DB.timeData.resultCode = 0;
        DB.timeData.dateClient = dateClient;
        DB.timeData.timeSync = Date.now() - dateClient;

        res.send(DB);

    } catch (e) {
        console.log(e)
    }
});


router.put('/isRunning/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/video_${gameNumber}.json`));
        let DB = JSON.parse(data);


        let isRunning = req.body.isRunning;
        let timeDif = req.body.timeDif;
        let timeMem = req.body.timeMem;

        if (isRunning !== undefined) {
            DB.timeData.isRunning = isRunning;
        }

        DB.timeData.timeDif = timeDif;


        DB.timeData.timeMem = timeMem;

        DB.timeData.runningTime = Date.now();

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DBs/DB_${stadium}/video_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.to(stadium).emit(`getVideoTime${gameNumber}`, DB);

        io.to(stadium).emit(`getPlayerStatus`, DB.timeData.isRunning)

    } catch (e) {
        console.log(e)
    }
});

router.post('/goalGIF/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let teamType = req.body.teamType;

        const io = req.app.locals.io;

        io.to(stadium).emit(`playGoalGIF_${teamType}${gameNumber}`, '');


    } catch (e) {
        console.log(e)
    }
});


router.options('/', cors());


module.exports = router;
