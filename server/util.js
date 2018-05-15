import {Schema} from 'mongoose';
import config from '../config/config';
import mgo from 'mongoose';

const mgoUri = `mongodb:\/\/${config.mongo.user}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/admin`;

let DB = null;

function INFO(message){
    console.log(`[INFO]${message}`);
}

function ERROR(message){
    console.log(`[ERROR]${message}`);
}

function initDB(){
    return new Promise((resolved, injected) => {
        mgo.connect(mgoUri).then(() => {
            DB = mgo.connection; 
            DB = DB.useDb(config.mongo.db);
            INFO('mongodb has been opened ...');
            resolved();
        });
    });
}


const models = {};

function getTicketModel(){
    let name, collection;
    name = collection = 'ticket';
    if(models[name] != null)return models[name];

    let schema = new Schema({
            "dest" : String,
            "period" : String,
            "days" : String,
            "comeFlight" : String,
            "backFlight" : String,
            "price" : String,
            "number" : String,
            "status": {type: Boolean, default: true}
    }, {collection: collection, timestamps: {createdAt: 'created', updateAt: 'updated'}});

    let model = DB.model(collection, schema);
    models[name] = model;
    return model;
}


function formatDate(d) {
    let parts = d.split('-');
    let year = parts[0];
    let month = parts[1].padStart(2, '0');
    let day = parts[2].padStart(2, '0');

    return `${year}-${month}-${day}`;
}


function diffDate(d1, d2){
    d1 = new Date(d1);
    d2 = new Date(d2);
    let diff = Math.abs(d1.getTime() - d2.getTime());
    let days = Math.ceil(diff/(1000 * 60 * 60 * 24));
    return days;
}

function parseDate(_d){
    let d = new Date(_d);
    let [year, month, day, hours, minutes] = [d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()];
    month++;
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export {getTicketModel, formatDate, diffDate, initDB};
