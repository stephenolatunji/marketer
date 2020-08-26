const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))


app.use(express.json());
app.use(cors());
app.use(helmet(
    {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self"],
                scriptSrc: ["'self"]
            }
        },
        referrerPolicy: { policy: 'same-origin'}
    }
));

const BDR = require('./Routes/BDR');
const pocROute = require('./Routes/poc');
const tasks = require('./Routes/tasks');
const adminRoute = require('./Routes/admin')

app.get('/', (req, res) => {
    res.send('Welcome to Eye Market!')
});

app.use('/BDR', BDR);
app.use('/pocs', pocROute);
app.use('/Task', tasks);
app.use('/admin', adminRoute);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});