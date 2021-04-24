const {Router} = require('express');
const router = Router();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
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


router.get('/', cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)


        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/devices.json`));
        let DB = JSON.parse(data);

        res.send(DB.devices)

    } catch (e) {
        console.log(e)
    }
});

router.put('/add', cors(), function (req, res) {
    try {

        const io = req.app.locals.io;

        const socket = req.app.locals.socket;


        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/devices.json`));
        let DB = JSON.parse(data);

        let isAuth = req.body.isAuth
        let pathname = req.body.pathname
        let lag = req.body.lag



        if (isAuth === false) {
            if (pathname.indexOf('tabloClient') !== -1) {
                DB.devices.push({id: socket.id, type: 'Main Tablo', lag: lag})
            } else {
                DB.devices.push({id: socket.id, type: 'undefined', lag: lag})
            }
        } else {
            if (DB.devices.findIndex(user => user.id === socket.id) !== -1) {
                DB.devices[DB.devices.findIndex(user => user.id === socket.id)].type = 'Admin'
            } else {
                DB.devices.push({id: socket.id, type: 'Admin', lag: lag, isLockLag: false})
            }
        }


        io.to(stadium).emit(`getDevices`, DB.devices)


        io.to(stadium).emit(`getLag${socket.id}`, DB.devices[DB.devices.findIndex(user => user.id === socket.id)].lag)


        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/devices.json`), json, 'utf8');

        res.send({resultCode: 0})

    } catch (e) {
        console.log(e)
    }
});

router.put('/', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/devices.json`));
        let DB = JSON.parse(data);

        let deviceType = req.body.deviceType;
        let deviceId = req.body.deviceId;

        let device = DB.devices.find(device => device.id === deviceId)

        device.type = deviceType

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/devices.json`), json, 'utf8');

        res.send({resultCode: 0})

        const io = req.app.locals.io;

        io.to(stadium).emit(`getDevices`, DB.devices)
        io.to(stadium).emit(`setDevicePage${deviceId}`, deviceType)

    } catch (e) {
        console.log(e)
    }
});

router.put('/lag', cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/devices.json`));
        let DB = JSON.parse(data);


        let deviceId = req.body.deviceId;
        let lag = req.body.lag;

        let device = DB.devices.find(device => device.id === deviceId)

        device.lag = lag

        device.isLockLag = false

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/devices.json`), json, 'utf8');

        res.send({resultCode: 0})

        const io = req.app.locals.io;

        io.to(stadium).emit(`getDevices`, DB.devices)
        io.to(stadium).emit(`setDeviceLag${deviceId}`, lag)

    } catch (e) {
        console.log(e)
    }
});

router.put('/autolag', cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let deviceId = req.body.deviceId;

        let data = fs.readFileSync(path.join(__dirname + `/DBs/DB_${stadium}/devices.json`));
        let DB = JSON.parse(data);

        let device = DB.devices.find(device => device.id === deviceId)

        device.isLockLag = true

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/devices.json`), json, 'utf8');

        res.send({resultCode: 0})


        const io = req.app.locals.io;

        io.to(stadium).emit(`setDeviceAutolag${deviceId}`, {deviceId: deviceId})

        io.to(stadium).emit(`getDevices`, DB.devices)

    } catch (e) {
        console.log(e)
    }
});



router.put('/preset/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DBs/DB_${stadium}/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let preset = req.body.preset;


        DB.gameInfo.preset = preset;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DBs/DB_${stadium}/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

        const io = req.app.locals.io;

        io.to(stadium).emit(`getPreset${gameNumber}`, DB.gameInfo.preset)

    } catch (e) {
        console.log(e)
    }
});



router.options('/', cors());


module.exports = router;