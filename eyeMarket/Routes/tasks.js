const express = require('express');
const router = express.Router();
require('dotenv').config();
const connectDB = require('../config/db');

const { BlobServiceClient } = require("@azure/storage-blob");
const azure = require('azure-storage');

const blobService__ = azure.createBlobService(process.env.BUCKET_NAME, process.env.KEY);

async function main() {

    const STORAGE_CONNECTION_STRING = process.env.STORAGE_CONNECTION_STRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);

    let i = 1;
    for await (const container of blobServiceClient.listContainers()) {
        console.log(`Container ${i++}: ${container.name}`);
    }
    // Create a container
    // const containerName = `eyemarket${new Date().getTime()}`;
    // const containerClient = blobServiceClient.getContainerClient(containerName);

    // const createContainerResponse = await containerClient.create();
    // console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId);

    // Delete container
    // await containerClient.delete();
}

main().catch((err) => {
    console.log('Error running sample:', err.message)
});


router.route('/')

    .get(async (req, res) => {
        try {
            await connectDB.query('SELECT *  FROM task ', (err, results) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: 'Can not fetch',
                        err
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        results
                    })
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

        if(req.body.task!==null){
            try {

                // get current week
                await connectDB.query(`SELECT WEEK(CURDATE()) AS week`, (err, week) => {
                    week_ = week[0].week;
                });
                // getting date and time 
                const date = new Date().getDate()+'-'+(new Date().getMonth()+parseInt("1"))+'-'+new Date().getFullYear();
                const time = (new Date().getHours()+parseInt("1"))+':'+new Date().getMinutes()+':'+new Date().getSeconds();
                
                for (let i = 0; i < req.body.task.length; i++) {
                    // getting data on req.body into const
                    const { pocId, taskType, action, user } = req.body.task[i];
                    // getting image base64 into const image
                    const image = req.body.task[i].image;
                    //converting base64 to buffer
                    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                    const type = matches[1];
                    const buffer = Buffer.from(matches[2], 'base64');
                    // setting file name
                    const fileName = 'image'+new Date().getTime()+'.jpg';
                    // send data into azure bucket
                    blobService__.createBlockBlobFromText('eyemarket', fileName, buffer, {contentType:type}, function(error, result, response) {
                        
                        if (error) {
                            console.log(error);
                        }
                        else {
                            // get image url
                            const imageUrl = "https://eyemarket6973837452.blob.core.windows.net/eyemarket/"+fileName;

                                // submitting into databsae
                                connectDB.query(`INSERT INTO task (pocId, action, taskType, user, week, image, date, time) VALUES ( '${pocId}', 'Awaiting AI', '${taskType}', '${user}', '${week_}', '${imageUrl}', '${date}', '${time}' )`,
                                    (err, result) => {
                                        if (err) {
                                            console.log(err)
                                        }
                                        else {
                                            console.log('success')
                                        }
                                    }
                                )
                        }
                    });
                }

                setTimeout(() => {
                    connectDB.query(`SELECT * FROM task WHERE user = '${req.body.user}' AND week = '${week_}'`,
                    (err, results) => {
    
                        if (err) {
                            return res.status(400).send({
                                success: false,
                                msg: 'Can not fetch',
                                err
                            })
                        }
                        else {
                            return res.status(200).json({
                                success: true,
                                results
                            })
                        }
    
                    })                   
                }, 8000);

            }
            // catch error in case
            catch (err) {
                res.status(500).send({
                    success: false,
                    Errors: err
                })
            }
        };
        // do for upload of oportunity if not null
        if(req.body.opportunity!==null){
            
        }
        // do for upload of survey if not null
        if(req.body.survey!==null){

        }

    });

router.route('/ai')

    .get(async (req, res) => {
        try {
            await connectDB.query("SELECT id, image, user, taskType FROM task WHERE action = 'Awaiting AI'", (err, results) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: 'Can not fetch',
                        err
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        results
                    })
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

    .patch(async (req, res) => {

        let trimmed = {};
        (req.body.good_execution)? trimmed.action = 'success' : trimmed.action = 'bad';
        trimmed.chest = req.body.present_classes.Chest;
        trimmed.glass = req.body.present_classes.Glass;
        trimmed.white_space = req.body.whitespace_condition;
        trimmed.contaminated = req.body.contamination_presence;
        trimmed.budweiser = req.body.present_classes.Budweiser;
        trimmed.trophy_stout = req.body.present_classes.TrophyStout;
        trimmed.trophy = req.body.present_classes.Trophy;
        trimmed.trophy_can = req.body.present_classes.TrophyCan;
        trimmed.beta_malt = req.body.present_classes.BetaMalt;

        try {

            
            connectDB.query(`UPDATE task SET ? WHERE id = ` + req.body.id, trimmed,

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



router.route('/:id')

    .get(async (req, res) => {


        const taskId = req.params.id;

        try {
            await connectDB.query('SELECT * FROM task WHERE id = ? ', [taskId], (err, results) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: 'Can not fetch',
                        err
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        results
                    })
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


    .patch(async (req, res) => {

        const taskId = req.params.id;
        let taskData = req.body;

        // if (taskData.contaminated) {
        //     taskData.action = 'bad';
        //     delete taskData.contaminated;
        // }
        // else if (!taskData.contaminated) {
        //     taskData.action = 'success';
        //     delete taskData.contaminated;
        // }

        try {

            connectDB.query(`UPDATE task SET ? WHERE id = ` + taskId, taskData,

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

router.route('/user/:email')

    .get(async (req, res) => {

        const email = req.params.email;

        try {
            await connectDB.query(`SELECT WEEK(CURDATE()) as week`, (err, week) => {
                week_ = week[0].week.toString();
            });
            await connectDB.query(`SELECT * FROM task WHERE user = '${email}' AND week = '${week_}'`,
                (err, results) => {

                    if (err) {
                        return res.status(400).send({
                            success: false,
                            msg: 'Can not fetch',
                            err
                        })
                    }
                    else {console.log(results)
                        return res.status(200).json({
                            success: true,
                            results
                        })
                    }

                })
        }
        catch (err) {
            res.status(500).send({
                success: false,
                err
            })
        }
    });






module.exports = router;