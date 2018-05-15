import express from 'express';
import log from 'morgan';
import {api} from './router';
import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import {initDB} from './util';
import fs from 'fs';
import config from '../config/config';
import session from 'express-session';

let NotFound = (req, resp, next) => {
    resp.writeHead(200, {
        'Content-Type': 'text/html;charset=utf-8'
    })
    resp.end('兄弟你走错了');
};

let app = express();
app.use(session({
    secret: 'lvmama',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
        maxAge:20 * 60 * 1000,  
    },  
}));

/*
app.use((req, resp, next) => {
    if(!req.headers["authorization"]){
        resp.setHeader("WWW-Authenticate", 'Basic realm=www.6renyou.com"');
        resp.writeHeader(401);
        resp.end();
        return;
    }
    
    let auth = new Buffer(req.header('authorization').slice(6), 'base64');
    if(auth.toString() != `${config.auth.user}:${config.auth.password}`){
        resp.setHeader("WWW-Authenticate", 'Basic realm=www.6renyou.com"');
        resp.writeHeader(401);
        resp.end();
        return;
    }
    next();
});
*/
app.use(compression());
app.use(log('dev'));
app.use(bodyParser.json());
app.use('/api', api);
app.use(express.static(path.join(__dirname, '../dist/')));

app.use(NotFound);

let port = parseInt(process.env.PORT || '8089');

let server = http.createServer(app);

server.on('listening', () => {
    console.log(`has listening ${port} ...`);
});

server.on('error', (err) => {
    switch(err.code){
        case 'EADDRINUSE':
            console.log(`port ${port} has been used!`);
            break;
        default:
            console.log(err.message);
    }
    process.exit(1);
})


initDB().then(() => {
    server.listen(port);
});
