const path = require('path')
const express = require('express')

const publicPath = path.join(__dirname, '../public');

const PORT = process.env.PORT || 3000;

var app = express()

// Static files
app.use(express.static(publicPath));

var server = app.listen(PORT, () => {
    console.log("Server up at port " + PORT)
})