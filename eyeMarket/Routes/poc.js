const express = require('express');
const router = express.Router();
require('dotenv').config();
const connectDB = require('../config/db');


router.route('/')
    .get(async(req, res) => {
        try{
            await connectDB.query('SELECT *  FROM poc ', (err, results) => {
                if(err){
                    return res.status(400).send({
                        success: false,
                        msg: 'Can not fetch',
                        err
                    })
                }
                else{
                    return res.status(200).json({
                        success: true,
                        results
                    })
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

router.route('/bdr/:email')
    .get(async (req, res) => {
        const email = req.params.email
        try {
            connectDB.query('SELECT * FROM poc WHERE email = ? ', [email],
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
                            poc: results
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
    });
    
// Get a specific poc
router.route('/:id')
    .get(async (req, res) => {
        const id = req.params.id
        try {

            await connectDB.query('SELECT * FROM poc WHERE id = ? ', [id],
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
                            user: results
                        })
                    }
                })
        }
        catch (err) {
            res.status(500).send({
                success: false,
                Errors: err
            })
        }
    })

router.route('/updateData')
    // Update poc's data
    .patch(async (req, res) => {

        let incoming = req.body;

        incoming.forEach(element => {
            visited = element.visited;
            schedule = element.schedule;
            traffic = element.traffic;
            id = element.id;

            const userData = {visited, schedule, traffic}

            try {
    
                connectDB.query(`UPDATE poc SET ? WHERE id = ` + id, userData,
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
            catch (err) {
                res.status(500).send({
                    success: false,
                    Errors: err
                })
            }
        });
        
    });

    // TMR fetching BDR

    router.route('/:TMR/:bdr')
        .get(async (req, res) => {
            const user = req.params
        })




    module.exports = router;