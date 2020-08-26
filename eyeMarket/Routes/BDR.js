const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const randomize = require('randomatic');
const sendgrid = require('@sendgrid/mail');
const connectDB = require('../config/db');

router.route('/')
    .get(async(req, res) => {
        //delete multiple rows
        //DELETE t1 FROM contacts t1 INNER JOIN contacts t2 WHERE t1.id < t2.id AND t1.email = t2.email;
        try{
           await connectDB.query('SELECT * FROM poc', (err, rows) => {
                if (!err) {
                    res.send(rows)
                }
                else {
                    console.log(err)
                }

            })
        }
        catch(err){
            res.status(500).send({
                success: false,
                err
            })
        }

    });

router.route('/login')
    .post(async (req, res) =>{
        const { email, password } = req.body;
        try{
        
            await connectDB.query(`SELECT * FROM user WHERE email = '${email}'`,
                (err, results) => {
                    if (err) {
                        return res.status(404).send({
                            msg: 'User does not exist',
                            Error: err
                        })
                    }
                    else {
                        if(results.length > 0){
                            // check password
                            const isMatch = bcrypt.compare(password, results[0].password);
                            console.log(isMatch)
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
                            }, async (err, token) => {
                                if (err) {
                                    return res.status(500).send({
                                        success: false,
                                        msg: 'Error Validating'
                                    })
                                }
                                res.json({
                                    success: true,
                                    user: results[0],
                                    token,
                                    msg: 'Signed in successfully'
                                })
                            })
                            // return res.status(200).send({
                            //     success: true,
                            //     msg: 'Logged In',
                            //     user: results[0]
                            // })
                        }
                        else{
                            res.status(404).send({
                                success: false,
                                msg: 'Email does not exist'
                            })
                        }

                    }
                    
                }
            )
        }
        catch(err){
            res.status(500).send({
                success: false,
                Errors: err
            })
        }
    });

// Get a specific BDR
router.route('/:id')
    .get(async(req, res) => {
        const id = req.params.id
        try{

            await connectDB.query('SELECT * FROM user WHERE id = ? ', [id],
                (err, results) => {
                    if (err) {
                        return res.status(404).send({
                            success: false,
                            msg: 'Not Found',
                            err
                        })
                    }
                    else {
                        return res.status(200).json({
                            success: true,
                            user: results[0]
                        })
                    }
                })
        }
        catch(err){
            res.status(500).send({
                success: false,
                Errors: err
            })
        }
    });

router.route('/checkUser/:email')
    .get(async (req, res) => {
        const email = req.params.email
        try {
            connectDB.query('SELECT id, type, email, activated FROM user WHERE email = ? ', [email],
                (err, results) => {
                    if (err) {
                        return res.status(404).send({
                            success: false,
                            msg: 'Not Found',
                            err
                        })
                    }
                    else {
                        return res.status(200).json({
                            success: true,
                            pocs: results
                        })
                    }
                })
        }
        catch (err) {
            return res.status(500).send({
                success: false,
                msg: 'Server Error',
                err
            })
        }
    })

    router.route('/user/:email')
        .get(async(req, res) => {
            const email = req.params.email
            try{
                connectDB.query('SELECT * FROM user JOIN poc using (email) WHERE email = ? ', [email],
                    (err, results) => {
                        if (err) {
                            return res.status(404).send({
                                success: false,
                                msg: 'Not Found',
                                err
                            })
                        }
                        else {
                            return res.status(200).json({
                                success: true,
                                pocs: results
                            })
                        }
                })
            }
            catch(err){
                return res.status(500).send({
                    success: false,
                    msg: 'Server Error',
                    err
                })
            }
    })

    // Update BDR's password
    .patch(async(req, res) => {
        const email = req.params.email;
        const password = req.body.password;
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            
            await connectDB.query(`UPDATE user SET password = '${hashed}', activated = '1' WHERE email = '${email}'`, 
                (err, results) => {
                    if (err) {
                        return res.status(400).send({
                            success: false,
                            msg: err
                        })
                    }
                    else {
                        return res.status(200).json({
                            success: true,
                            msg: 'Updated Successfully',
                            results
                        })
                    }
                })
        }
        catch(err){
            res.status(500).send({
                success: false,
                Errors: err
            })
        }
    
    });

router.route('/forgot-password')
    .post(async (req, res) => {

        const email = req.body.email;
        const token = randomize('aA', 5);

        try{
            connectDB.query('SELECT email FROM user WHERE email = ? AND activated = ?', [email, 1],
                (err, results) => {
                   if(results.length > 0) {
                    (async () => {
                       
                        sendgrid.setApiKey(process.env.SEND_GRID_TOKEN);
                        const msg = {
                            to: email,
                            from: 'info@eyemarket',
                            subject: 'EYEMARKET: Your Password',
                            html: `<h4>Dear User, your password has been successfully reset. Kindly use: <b> ${token} </b> as your new password.</h4>`
                         };
    
                         const salt = await bcrypt.genSalt(10);
                         const hash = await bcrypt.hash(token, salt);
    
                         await connectDB.query(`UPDATE user SET password = '${hash}' WHERE email = '${email}'`, 
                         (err, result) => {
                             if(err){
                                 return res.status(400).send({
                                     success: false,
                                     msg: err
                                 })
                             }
                             else{
                                 sendgrid
                                     .send(msg)
                                     .then(() => {}, error => {
                                     
                                         if (error.response) {
                                            return err
                                         }
                                     });
                             }
                         });
    
                         return res.status(200).send({
                            success: "Mail Sent Succesfully! Go back to Login"
                         })
                      })();
                    }

                    else {
                        res.status(200).json({
                            success: 'Invalid Email'
                        })
                    }
                })
        }
        catch(err){
            res.status(500).json({
                success: false,
                err
            })
        }
    })
    module.exports = router;