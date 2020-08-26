const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectDB = require('../config/db');


router.route('/')
    .post(async(req, res) => {
        const {email, password} = req.body;
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            await connectDB.query(`INSERT INTO admin SET email = '${email}', password = '${hashed}'`, (err, result) => {
                if(err){
                    res.status(400).send('Unable to register')
                }
                else{
                    const now = Math.floor(Date.now() / 1000),
                        iat = (now - 10),
                        jwtId = Math.random().toString(36).substring(7);

                    const payload = {
                        iat: iat,
                        jwtid: jwtId,
                    };	

                    jwt.sign(payload, process.env.JWT_SECRET, {
                        expiresIn: 3600,
                    }, async (err, token) => {
                        if (err) {
                            return res.status(500).send({
                                success: false,
                                msg: 'Error Validating'
                            })
                        }
                        res.json({
                            success: true,
                            token,
                            msg: 'Signed in successfully'
                        })
                    })
                }
            })
        }
        catch(err){
            res.status(500).json({
                success: false,
                msg: err
            })
        }

    });

router.route('/login')
    .post(async (req, res) => {
        const { email, password } = req.body;
        try {
            await connectDB.query(`SELECT * FROM admin WHERE email = '${email}'`,
                (err, results) => {
                    if (err) {
                        return res.status(404).send({
                            msg: 'User does not exist',
                            Error: err
                        })
                    }
                    else {
                        if (results.length <= 0) {
                            res.status(401).send({
                                success: false,
                                msg: 'Email does not exist'
                            })
                        }
                        else {
                            // check password
                            const isMatch = bcrypt.compare(password, results[0].password);
                        
                            if (!isMatch) {
                                return res.status(401).send({
                                    success: false,
                                    message: 'Invalid credentials'
                                })
                            }
                            const now = Math.floor(Date.now() / 1000),
                                iat = (now - 10),
                                jwtId = Math.random().toString(36).substring(7);

                            const payload = {
                                iat: iat,
                                jwtid: jwtId,
                            };

                            jwt.sign(payload, process.env.JWT_SECRET, {
                                expiresIn: 3600,
                            }, async(err, token) => {
                                if(err){
                                    return res.status(500).send({
                                        success: false,
                                        msg: 'Error Validating'
                                    })
                                }
                                res.json({
                                    success: true,
                                    token,
                                    msg: 'Signed in successfully'
                                })
                            })

                        }
                    }

                }
            )
        }
        catch (err) {
            res.status(500).send({
                success: false,
                Errors: err
            })
        }
    });

router.route('/dashboard')
    .get(async (req, res) => {
        try {
            await connectDB.query('SELECT *, task.id as taskId, user.name FROM task INNER JOIN poc on task.pocId = poc.id INNER JOIN user on poc.email = user.email', 
            (err, rows) => {
                if (!err) {
                    res.send(rows)
                }
                else {
                    console.log(err)
                }

            })
        }
        catch (err) {
            res.status(500).send({
                success: false,
                err
            })
        }

    })

    .post(async (req, res) => {

        const date = req.body.date;

        try {
            await connectDB.query('SELECT * from schedule ', (err, schedule) => {
                if (err) {
                    throw err
                }
                else {
                    
                    connectDB.query(`SELECT * from task WHERE date = '${date}'`, (err, task) => {
                        (async () => {
                            await schedule.forEach(element => {
                                chiller = task.filter(task => task.user.toLowerCase() == element.email.toLowerCase() && task.taskType == 'chiller');
                                poster = task.filter(task => task.user.toLowerCase() == element.email.toLowerCase() && task.taskType == 'poster');
                                chair = task.filter(task => task.user.toLowerCase() == element.email.toLowerCase() && task.taskType == 'chair');

                                element.chillerLength = chiller.length;
                                element.posterLength = poster.length;
                                element.chairLength = chair.length;
                                element.totalTasks = element.chillerLength + element.posterLength + element.chairLength
                            });
                        })();

                        res.json({
                            success: true,
                            schedule,
                            msg: 'Done!'
                        })
                    })
                }
            })
        }
        catch (err) {

        }
    })

    router.route('/schedule')
      

    
module.exports = router;