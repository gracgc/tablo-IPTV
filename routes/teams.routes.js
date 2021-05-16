const {Router} = require('express');
const router = Router();
const fs = require('fs')
const path = require('path');
const cors = require('cors');
const authMW = require('../middleware/authMW')
const config = require('config')
const resizeOptimizeImages = require('resize-optimize-images');

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


router.get('/:gameNumber', cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))


        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);


        DB.teams.find(t => t.teamType === 'home').logo = `http://${req.get('host')}/api/teams/homeLogo/${gameNumber}/${Date.now()}`;
        DB.teams.find(t => t.teamType === 'guests').logo = `http://${req.get('host')}/api/teams/guestsLogo/${gameNumber}/${Date.now()}`;

        DB.teams.find(t => t.teamType === 'home').goalGIF = `http://${req.get('host')}/api/teams/homeGoalGIF/${gameNumber}/${Date.now()}`;
        DB.teams.find(t => t.teamType === 'guests').goalGIF = `http://${req.get('host')}/api/teams/guestsGoalGIF/${gameNumber}/${Date.now()}`;


        DB.teams.resultCode = 0;

        res.send(DB.teams)
    } catch (e) {
        console.log(e)
    }
});

router.get('/homeLogo/:gameNumber/:dateNow', cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let img = path.join(__dirname + `/DBs/DB_${stadium}/img/home_logo_${gameNumber}.png`);

        res.sendFile(img);



    } catch (e) {
        console.log(e)
    }
});

router.get('/guestsLogo/:gameNumber/:dateNow', function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let img = path.join(__dirname + `/DBs/DB_${stadium}/img/guests_logo_${gameNumber}.png`);


        res.sendFile(img);

    } catch (e) {
        console.log(e)
    }
});

router.get('/homeGoalGIF/:gameNumber/:dateNow', cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let img = path.join(__dirname + `/DBs/DB_${stadium}/gif/home_goal_${gameNumber}.gif`);

        res.sendFile(img);



    } catch (e) {
        console.log(e)
    }
});

router.get('/guestsGoalGIF/:gameNumber/:dateNow', function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let img = path.join(__dirname + `/DBs/DB_${stadium}/gif/guests_goal_${gameNumber}.gif`);


        res.sendFile(img);

    } catch (e) {
        console.log(e)
    }
});

router.get('/fastGameLogo/:gameNumber', cors(), async function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        fs.createReadStream(path.join(__dirname + `/PNG/logoFastGame.png`)).pipe(fs.createWriteStream(path.join(__dirname + `/DBs/DB_${stadium}/img/home_logo_${gameNumber}.png`)));

        fs.createReadStream(path.join(__dirname + `/PNG/logoFastGame.png`)).pipe(fs.createWriteStream(path.join(__dirname + `/DBs/DB_${stadium}/img/guests_logo_${gameNumber}.png`)));


        res.send({resultCode: 0});


    } catch (e) {
        console.log(e)
    }
});


router.post('/homelogo/:gameNumber', cors(), async function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;


        let img = req.files.file


        img.name = `home_logo_${gameNumber}.png`

        await img.mv(`${__dirname}/DBs/DB_${stadium}/img/${img.name}`)

        const options = {
            images: [path.join(__dirname + `/DBs/DB_${stadium}/img/home_logo_${gameNumber}.png`)],
            width: 200,
            quality: 50
        };

        try {
            resizeOptimizeImages(options);
        } catch (e) {
            console.log(e)
        }


        res.send({resultCode: 0});


    } catch (e) {
        console.log(e)
    }
});

router.post('/guestslogo/:gameNumber', cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;


        let img = req.files.file


        img.name = `guests_logo_${gameNumber}.png`

        img.mv(`${__dirname}/DBs/DB_${stadium}/img/${img.name}`)

        const options = {
            images: [path.join(__dirname + `/DBs/DB_${stadium}/img/home_logo_${gameNumber}.png`)],
            width: 200,
            quality: 50
        };

        resizeOptimizeImages(options);

        res.send({resultCode: 0});


    } catch (e) {
        console.log(e)
    }
});


router.post('/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let homeName = req.body.homeName;
        let homeColor = req.body.homeColor;
        let homeGamers = req.body.homeGamers;
        let guestsName = req.body.guestsName;
        let guestsColor = req.body.guestsColor;
        let guestsGamers = req.body.guestsGamers;

        let newTeams = [
            {
                "name": homeName,
                "color": homeColor,
                "counter": 0,
                "teamType": "home",
                "timeOut": false,
                "gamers": homeGamers
            },
            {
                "name": guestsName,
                "color": guestsColor,
                "counter": 0,
                "teamType": "guests",
                "timeOut": false,
                "gamers": guestsGamers
            }
        ];


        DB.teams = newTeams;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        DB.teams.find(t => t.teamType === 'home').logo = `http://${req.get('host')}/api/teams/homeLogo/${gameNumber}/${Date.now()}`;
        DB.teams.find(t => t.teamType === 'guests').logo = `http://${req.get('host')}/api/teams/guestsLogo/${gameNumber}/${Date.now()}`;

        io.to(stadium).emit(`getTeams${gameNumber}`, DB.teams)

    } catch (e) {
        console.log(e)
    }
});

router.put('/gamerGoal/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;


        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let id = req.body.id;
        let symbol = req.body.symbol;


        const gamer = DB.teams.find((team) => team.teamType === teamType)
            .gamers.find((g) => g.id === id);
        if (symbol === '+') {
            gamer.goals = gamer.goals + 1;
        }
        if (symbol === '-' && gamer.goals > 0) {
            gamer.goals = gamer.goals - 1;
        }


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        DB.teams.find(t => t.teamType === 'home').logo = `http://${req.get('host')}/api/teams/homeLogo/${gameNumber}/${Date.now()}`;
        DB.teams.find(t => t.teamType === 'guests').logo = `http://${req.get('host')}/api/teams/guestsLogo/${gameNumber}/${Date.now()}`;

        io.to(stadium).emit(`getTeams${gameNumber}`, DB.teams)


    } catch (e) {
        console.log(e)
    }
});

router.put('/teamGoal/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        const io = req.app.locals.io;

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let symbol = req.body.symbol;


        const team = DB.teams.find((team) => team.teamType === teamType);

        if (symbol === '+') {
            team.counter = team.counter + 1;
        }
        if (symbol === '-' && team.counter > 0) {
            team.counter = team.counter - 1;
        }


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})



        DB.teams.find(t => t.teamType === 'home').logo = `http://${req.get('host')}/api/teams/homeLogo/${gameNumber}/${Date.now()}`;
        DB.teams.find(t => t.teamType === 'guests').logo = `http://${req.get('host')}/api/teams/guestsLogo/${gameNumber}/${Date.now()}`;

        io.to(stadium).emit(`getTeams${gameNumber}`, DB.teams);

        if (DB.gameInfo.gameTime.isRunning && symbol === '+') {
            io.to(stadium).emit(`switchTimer${gameNumber}`, '');
        }

    } catch (e) {
        console.log(e)
    }
});

router.put('/gamerStatus/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;


        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let id = req.body.id;


        let gamer = DB.teams.find(team => team.teamType === teamType)
            .gamers.find(g => g.id === id);

        if (gamer.status === 'deleted') {
            gamer.status = 'in game';
        } else {
            gamer.status = 'deleted';
        }

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        DB.teams.find(t => t.teamType === 'home').logo = `http://${req.get('host')}/api/teams/homeLogo/${gameNumber}/${Date.now()}`;
        DB.teams.find(t => t.teamType === 'guests').logo = `http://${req.get('host')}/api/teams/guestsLogo/${gameNumber}/${Date.now()}`;

        io.to(stadium).emit(`getTeams${gameNumber}`, DB.teams)


    } catch (e) {
        console.log(e)
    }
});

router.put('/onField/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;


        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let id = req.body.id;
        let onField = req.body.onField;


        const gamer = DB.teams.find((team) => team.teamType === teamType)
            .gamers.find((g) => g.id === id);
        gamer.onField = onField !== true;


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        DB.teams.find(t => t.teamType === 'home').logo = `http://${req.get('host')}/api/teams/homeLogo/${gameNumber}/${Date.now()}`;
        DB.teams.find(t => t.teamType === 'guests').logo = `http://${req.get('host')}/api/teams/guestsLogo/${gameNumber}/${Date.now()}`;

        io.to(stadium).emit(`getTeams${gameNumber}`, DB.teams)


    } catch (e) {
        console.log(e)
    }
});

router.put('/penalty/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;


        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let teamType = req.body.teamType;
        let id = req.body.id;
        let timeOfPenalty = req.body.timeOfPenalty;
        let whenWasPenalty = req.body.whenWasPenalty;


        const gamer = DB.teams.find((team) => team.teamType === teamType)
            .gamers.find((g) => g.id === id);
        gamer.timeOfPenalty = timeOfPenalty;
        gamer.whenWasPenalty = whenWasPenalty;


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname +
            `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0});

        const io = req.app.locals.io;

        DB.teams.find(t => t.teamType === 'home').logo = `http://${req.get('host')}/api/teams/homeLogo/${gameNumber}/${Date.now()}`;
        DB.teams.find(t => t.teamType === 'guests').logo = `http://${req.get('host')}/api/teams/guestsLogo/${gameNumber}/${Date.now()}`;

        io.to(stadium).emit(`getTeams${gameNumber}`, DB.teams)

    } catch (e) {
        console.log(e)
    }
});




router.options('/', cors());


module.exports = router;
