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

        let data = fs.readFileSync(path.join(__dirname + `/DB_${stadium}/saved_games.json`));
        let DB = JSON.parse(data);
        //

        if (!data) {
            res.send({resultCode: 10});
            console.log('Games is not exist')
        } else {
            DB.resultCode = 0;
            res.send(DB)
        }

    } catch (e) {
        console.log(e)
    }
});

router.post('/', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let data = fs.readFileSync(path.join(__dirname + `/DB_${stadium}/saved_games.json`));

        let DB = JSON.parse(data);

        let gameName = req.body.gameName;
        let gameNumber = req.body.gameNumber;
        let gameType = req.body.gameType;

        let game = {
            gameName: gameName,
            gameNumber: gameNumber,
            gameType: gameType
        };

        DB.savedGames.push(game);

        if (!gameName || !gameNumber || !gameType) {
            res.send({resultCode: 10});
            console.log('Not enought data')
        } else {
            let json = JSON.stringify(DB);

            fs.writeFileSync(path.join(__dirname +
                `/DB_${stadium}/saved_games.json`), json, 'utf8');

            res.send({resultCode: 0})
        }

    } catch (e) {
        console.log(e)
    }

});

router.put('/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        const io = req.app.locals.io;

        let gameNumber = req.params.gameNumber;

        fs.unlinkSync(path.join(__dirname +
            `/DB_${stadium}/game_${gameNumber}.json`));

        fs.unlinkSync(path.join(__dirname +
            `/DB_${stadium}/video_${gameNumber}.json`));
        
        try {
            fs.unlinkSync(path.join(__dirname +
                `/DB_${stadium}/img/home_logo_${gameNumber}.png`));

            fs.unlinkSync(path.join(__dirname +
                `/DB_${stadium}/img/guests_logo_${gameNumber}.png`));
        } catch (e) {
            
        }


        let data = fs.readFileSync(path.join(__dirname, `/DB_${stadium}/saved_games.json`));
        let DB = JSON.parse(data);

        let data2 = fs.readFileSync(path.join(__dirname + `/DB_${stadium}/game_number.json`));
        let DB2 = JSON.parse(data2);


        let deletedGame = DB.savedGames.findIndex(g => g.gameNumber === +gameNumber)


        DB.savedGames.splice(deletedGame, 1);


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DB_${stadium}/saved_games.json`), json, 'utf8');

        let json2 = JSON.stringify(DB2);

        fs.writeFileSync(path.join(__dirname, `/DB_${stadium}/game_number.json`), json2, 'utf8');

        res.send({resultCode: 0});



        io.emit(`getSavedGames_${stadium}`, DB.savedGames)

    } catch
        (e) {
        console.log(e)
    }
})

router.options('/', cors());


module.exports = router;
