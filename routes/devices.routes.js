const {Router} = require('express');
const router = Router();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const authMW = require('../middleware/authMW')


router.get('/', cors(), function (req, res) {
    try {
        let data = fs.readFileSync(path.join(__dirname + `/DB/devices.json`));
        let DB = JSON.parse(data);

        res.send(DB.devices)

    } catch (e) {
        console.log(e)
    }
});

router.put('/', authMW, cors(), function (req, res) {
    try {
        let data = fs.readFileSync(path.join(__dirname + `/DB/devices.json`));
        let DB = JSON.parse(data);

        let deviceType = req.body.deviceType;
        let deviceId = req.body.deviceId;

        let device = DB.devices.find(device => device.id === deviceId)

        device.type = deviceType

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/devices.json`), json, 'utf8');

        res.send({resultCode: 0})

        const io = req.app.locals.io;

        io.emit('getDevices', DB.devices)
        io.emit(`setDevicePage${deviceId}`, deviceType)

    } catch (e) {
        console.log(e)
    }
});

router.put('/lag', cors(), function (req, res) {
    try {
        let data = fs.readFileSync(path.join(__dirname + `/DB/devices.json`));
        let DB = JSON.parse(data);


        let deviceId = req.body.deviceId;
        let lag = req.body.lag;

        let device = DB.devices.find(device => device.id === deviceId)

        device.lag = lag

        device.isLockLag = false

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/devices.json`), json, 'utf8');

        res.send({resultCode: 0})

        const io = req.app.locals.io;

        io.emit('getDevices', DB.devices)
        io.emit(`setDeviceLag${deviceId}`, lag)

    } catch (e) {
        console.log(e)
    }
});

router.put('/autolag', cors(), function (req, res) {
    try {

        let deviceId = req.body.deviceId;

        let data = fs.readFileSync(path.join(__dirname + `/DB/devices.json`));
        let DB = JSON.parse(data);

        let device = DB.devices.find(device => device.id === deviceId)

        device.isLockLag = true

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/devices.json`), json, 'utf8');

        res.send({resultCode: 0})


        const io = req.app.locals.io;

        io.emit(`setDeviceAutolag${deviceId}`, {deviceId: deviceId})

        io.emit('getDevices', DB.devices)

    } catch (e) {
        console.log(e)
    }
});



router.put('/preset/:gameNumber', authMW, cors(), function (req, res) {
    try {
        let gameNumber = req.params.gameNumber;

        let data = fs.readFileSync(path.join(__dirname, `/DB/game_${gameNumber}.json`));
        let DB = JSON.parse(data);

        let preset = req.body.preset;


        DB.gameInfo.preset = preset;

        let json = JSON.stringify(DB);

        fs.writeFileSync(path.join(__dirname, `/DB/game_${gameNumber}.json`), json, 'utf8');

        res.send({resultCode: 0})

        const io = req.app.locals.io;

        io.emit(`getPreset${gameNumber}`, DB.gameInfo.preset)

    } catch (e) {
        console.log(e)
    }
});



router.options('/', cors());


module.exports = router;