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
        return stadiums['default']
    }
}

router.get('/:gameNumber', function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        res.send(DB.logData)

    } catch (e) {
        console.log(e)
    }
});

router.post('/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let newLogItem = req.body.newLogItem;

        if (DB.logData.gameLog.length === 0) {

            DB.logData.gameLog.push(
                {
                    item: newLogItem,
                    id: 1
                }
            )
        } else {
            if (newLogItem === DB.logData.gameLog[DB.logData.gameLog.length - 1].item && DB.logData.gameLog[DB.logData.gameLog.length - 1].item.indexOf('Конец') !== -1) {

            } else {

                DB.logData.gameLog.push(
                    {
                        item: newLogItem,
                        id: DB.logData.gameLog[DB.logData.gameLog.length - 1].id + 1
                    }
                );
            }
        }

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})


        const io = req.app.locals.io;

        io.to(stadium).emit(`getLog${gameNumber}`, DB.logData)

    } catch (e) {
        console.log(e)
    }
});

router.put('/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let deletedItem = req.body.deletedItem;

        DB.logData.gameLog.splice(deletedItem, 1);

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

        const io = req.app.locals.io;

        io.to(stadium).emit(`getLog${gameNumber}`, DB.logData)

    } catch (e) {
        console.log(e)
    }
});

router.put('/temp/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;


        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let newLogItem = req.body.newLogItem;




        DB.logData.tabloLog.tempLog = newLogItem


        const io = req.app.locals.io;

        io.to(stadium).emit(`getTempLog${gameNumber}`, DB.logData.tabloLog.tempLog);

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

    } catch (e) {
        console.log(e)
    }
});

router.post('/cons/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let gamerId = req.body.gamerId;
        let teamType = req.body.teamType;
        let newLogItem = req.body.newLogItem;

        let newLog = {
            id: gamerId,
            teamType: teamType,
            item: newLogItem
        };

        DB.logData.tabloLog.consLog.push(newLog);

        const io = req.app.locals.io;

        io.to(stadium).emit(`getLog${gameNumber}`, DB.logData);

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

    } catch (e) {
        console.log(e)
    }
});

router.put('/cons/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let deletedItem = req.body.deletedItem;

        DB.logData.tabloLog.consLog.splice(deletedItem, 1);

        const io = req.app.locals.io;

        io.to(stadium).emit(`getLog${gameNumber}`, DB.logData);

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

    } catch (e) {
        console.log(e)
    }
});

router.get('/export/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let logTXT = `События игры ${DB.gameInfo.gameName}` + '\n' + '\n'

        DB.logData.gameLog.forEach((value) => {
            logTXT += value.item + '\n'
        })

        fs.writeFileSync(path.join(__dirname + `/DBs/DB_${stadium}/logTXT/${DB.gameInfo.gameName}_${gameNumber}_log.txt`), logTXT, 'utf8');

        let exportLog = path.join(__dirname + `/DBs/DB_${stadium}/logTXT/${DB.gameInfo.gameName}_${gameNumber}_log.txt`);

        res.sendFile(exportLog)


    } catch (e) {
        console.log(e)
    }
});


router.options('/', cors());


module.exports = router;