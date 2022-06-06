const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
require('dotenv').config();

router.use(express.json());

const users = [];

router.post('/create', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const user = {username : req.body.username, password : hashedPassword};
        users.push(user);
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({accessToken : accessToken});
        console.log(users);
    }catch(err){
        res.status(500).send('Failed to create user');
    }

});


router.post('/login',authenticateUser,async (req, res) => {
    const curruser = users.find(user => user.username === req.body.username);
    console.log(curruser);
    if(curruser == null){
        return res.status(500).send('Failed to login');
    }
    try{
        if(await bcrypt.compare(req.body.password, curruser.password,)){
            res.status(200).send('Login successful');
        }else{
            res.send('Error');
        }

    }catch(err){
        res.status(500).send('Failed to login');
    }
})

function authenticateUser(req,res,next){
    const authHeader = req.headers['authorization'];
    if(authHeader === undefined) return res.status(401).end();
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user) => {
        if(err) return res.status(401).end()
        req.user = user;
        next();
    })


}

module.exports = router;