const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const authMW = require('../middleware/authMW')
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


router.get('/', function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_number.json`));
        let DB = JSON.parse(data);

        DB.resultCode = 0;
        res.send(DB)


    } catch (e) {
        console.log(e)
    }
});

router.get('/start', function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_number.json`));
        let DB = JSON.parse(data);



        res.send({gameNumber: DB.gameNumber});


    } catch (e) {
        console.log(e)
    }
});


router.put('/', authMW, function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.body.gameNumber;


        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_number.json`));
        let DB = JSON.parse(data);

        DB.gameNumber = gameNumber;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/game_number.json`), json, 'utf8');


        res.send({resultCode: 0});

        const io = req.app.locals.io;

        io.to(stadium).emit(`getGameNumber`, gameNumber)


    } catch (e) {
        console.log(e)
    }
});

router.options('/', cors());

module.exports = router;