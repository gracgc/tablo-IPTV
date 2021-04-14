const {Router} = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require("bcrypt")
const config = require("config")
const jwt = require("jsonwebtoken")

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

router.post('/login', cors(), async function (req, res) {
    try {
        let requrl = getHost(req.get('host'))

        let stadium = getStadium(requrl)

        const password = req.body.password

        let data = fs.readFileSync(path.join(__dirname, `/DB_${stadium}/auth.json`));
        let DB = JSON.parse(data);

        const isPassValid = bcrypt.compareSync(password, DB.password)
        if (!isPassValid) {
            return res.send({message: "Invalid password", resultCode: 10})
        }
        const token = jwt.sign({id: DB.id}, config.get("secretKey"), {expiresIn: "1000000d"})
        return res.send({
            token,
            id: DB.id,
            resultCode: 0
        })
    } catch (e) {
        console.log(e)
    }
});



router.options('/', cors());


module.exports = router;