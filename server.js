const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');

const router = require('./api/routes/router');

const app = express();
const port = process.env.PORT ?? 3000; //T:per default port 3000
//T Optional: set PORT=8000

// Serving static files from folder 'files'
app.use(express.static(path.join(__dirname, 'files')));

// Parse JSON bodies (from requests)
app.use(bodyParser.json()); 

// Include the routes
app.use('/api', router);

app.listen(port, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server listening at http://localhost:${port}`)
    }
});

