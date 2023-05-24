import express from 'express';
// const express = require('express');

import mongoose from 'mongoose';
import {APP_PORT, DB_URL } from './config';
import errorHandler from './middlewares/errorHandler';
import path from 'path';
const app = express();
import routes from './routes';  
import cors from 'cors';


mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open',() => {
    console.log("DB Connected...");
});


global.appRoot = path.resolve(__dirname);
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use('/api',routes);
app.use('/uploads', express.static('uploads'));
app.use('/', (req, res) => {
    res.send(`
  <h1>Welcome to Rest APIs</h1>
  You may contact me at 9520299646
  Or You may reach out to me for any question related to this Apis: manzarhamidi0911@gmail.com
  `);
});





app.use(errorHandler)
app.listen(APP_PORT,() => console.log(`Listening on port ${APP_PORT}.`));
