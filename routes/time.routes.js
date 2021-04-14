const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const authMW = require('../middleware/authMW');
const config = require('config')


let stadiums = config.get('stadiums')

let getHost = (host) => {
    return host.split(':')[0]
}

let getStadium = (host) => {
    if (stadiums[host]) {
        return stadiums[host]
    } else {
        return 0
    }
}



router.get('/:gameNumber/:dateClient', cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let dateClient = +req.params.dateClient;

        let data = fs.readFileSync(path.join(__dirname + `/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        DB.gameInfo.gameTime.resultCode = 0;
        DB.gameInfo.gameTime.dateClient = dateClient;
        DB.gameInfo.gameTime.dateServer = Date.now();

        res.send(DB.gameInfo.gameTime);


    } catch (e) {
        console.log(e)
    }
});

router.get('/sync/sync/:dateClient', cors(), function (req, res) {
    try {

        let dateClient = req.params.dateClient;


        res.send({dateClient: dateClient, dateServer: Date.now()});


    } catch (e) {
        console.log(e)
    }
});


router.get('/timeout/:gameNumber', function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        DB.resultCode = 0;
        res.send(DB.gameInfo.gameTime.timeoutData);


    } catch (e) {
        console.log(e)
    }
});

router.put('/isRunning/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let isRunning = req.body.isRunning;
        let timeDif = req.body.timeDif;
        let timeMem = req.body.timeMem;
        let timeMemTimer = req.body.timeMemTimer;
        let deadLine = req.body.deadLine;
        let period = req.body.period;
        let smallOvertime = req.body.smallOvertime;
        let bigOvertime = req.body.bigOvertime;

        DB.gameInfo.gameTime.isRunning = isRunning;
        if (isRunning === false) {
            DB.gameInfo.gameStatus = "Not going"
        } else {
            DB.gameInfo.gameStatus = "Going"
        }

        DB.gameInfo.gameTime.timeData.timeDif = timeDif;
        DB.gameInfo.gameTime.timeData.timeMem = timeMem;
        DB.gameInfo.gameTime.timeData.timeMemTimer = timeMemTimer;
        DB.gameInfo.gameTime.timeData.deadLine = deadLine;
        DB.gameInfo.gameTime.runningTime = Date.now();
        DB.gameInfo.gameTime.period = period;
        DB.gameInfo.gameTime.smallOvertime = smallOvertime;
        DB.gameInfo.gameTime.bigOvertime = bigOvertime;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getTime${gameNumber}_${requrl}`, DB.gameInfo.gameTime);

        io.emit(`getGame${gameNumber}_${requrl}`, DB.gameInfo)

    } catch (e) {
        console.log(e)
    }
});

router.put('/isRunningTimeout/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let isRunning = req.body.isRunning;
        let timeDif = req.body.timeDif;
        let timeMem = req.body.timeMem;
        let timeMemTimer = req.body.timeMemTimer;
        let deadLine = req.body.deadLine;


        DB.gameInfo.gameTime.timeoutData.isRunning = isRunning;
        DB.gameInfo.gameTime.timeoutData.timeData.timeDif = timeDif;
        DB.gameInfo.gameTime.timeoutData.timeData.timeMem = timeMem;
        DB.gameInfo.gameTime.timeoutData.timeData.timeMemTimer = timeMemTimer;
        DB.gameInfo.gameTime.timeoutData.timeData.deadLine = deadLine;
        DB.gameInfo.gameTime.timeoutData.runningTime = Date.now();


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getTimeout${gameNumber}_${requrl}`, DB.gameInfo.gameTime.timeoutData)

    } catch (e) {
        console.log(e)
    }
});

router.put('/deadline/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);


        let deadLine = req.body.deadLine;
        let timeMemTimer = req.body.timeMemTimer;
        let timeDif = req.body.timeDif;
        let timeMem = req.body.timeMem;


        DB.gameInfo.gameTime.timeData.deadLine = deadLine;
        DB.gameInfo.gameTime.timeData.timeMemTimer = timeMemTimer;
        DB.gameInfo.gameTime.timeData.timeDif = timeDif;
        DB.gameInfo.gameTime.timeData.timeMem = timeMem;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.emit(`getTime${gameNumber}_${requrl}`, DB.gameInfo.gameTime)


    } catch (e) {
        console.log(e)
    }
});



router.options('/', cors());


module.exports = router;
