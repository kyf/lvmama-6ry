import {Router} from 'express';
import {getTicketModel} from '../util';
import config from '../../config/config';

let api = Router();
api.post('/list', (req, resp) => {
    let {pageIndex, pageSize, searchkey} = req.body;

    if(!pageIndex || pageIndex == null){
        pageIndex = 1;
    }
    if(!pageSize || pageSize == null){
        pageSize = 20;
    }
    let start = (pageIndex - 1) * pageSize;

    let model = getTicketModel();
    let where = {status: true};
    if(searchkey && searchkey != ''){
        where['dest'] = {'$regex': new RegExp(searchkey)};
    }
    let fields = null;
    let options = {
        limit: pageSize,
        skip: start,
        sort: {'_id':-1}
    };

    model.count(where, (err, total) => {
        if(err != null){
            resp.json({status: false, message: err.message});
            return;
        }

        model.find(where, fields, options, (err, docs) => {
            if(err != null){
                resp.json({status: false, message: err.message});
                return;
            }

            resp.json({status: true, data: docs, total: total}); 
        });
    });
});

api.post('/add', (req, resp) => {
    let {dest, period, days, comeFlight, backFlight, price, number} = req.body;
    
    let fields = ['dest', 'period', 'days', 'comeFlight', 'backFlight', 'price', 'number'];

    for(let i=0; i<fields.length; i++){
        if(req.body[fields[i]] == ''){
            resp.json({status: false, message: '参数错误'});
            return;
        }
    }

    let model = getTicketModel();
    let data = {
        dest: dest, 
        period: period, 
        days: days, 
        comeFlight: comeFlight, 
        backFlight: backFlight, 
        price: price, 
        number: number,
    };
    model.create(data, (err, ret) => {
        if(err != null){
            resp.json({status: false, message: err.message});
            return;
        }

        resp.json({status: true, message: 'success'});
    });
});

api.get('/delete/:id', (req, resp) => {
    let id = req.params['id'];
    let model = getTicketModel();
    model.update({"_id": id}, {"$set":{"status": false}}, (err, ret) => {
        if(err != null){
            resp.json({status: false, message: err.message});
            return;
        }

        resp.json({status: true, data: ret});
    });
});


api.post('/update/:id', (req, resp) => {
    let id = req.params.id;
    let number = req.body.number;
    
    let model = getTicketModel();
    model.update({"_id": id}, {"$set": {"number":number}}, (err, ret) => {
        if(err != null){
            resp.json({status: false, message: err.message});
            return;
        }

        resp.json({status: true, data: ret});
    });
});

api.post('/login', (req, resp) => {
    let {username, password} = req.body;
    if(username == config.auth.user && password == config.auth.password){
        req.session.username = "admin";
        resp.json({status: true});
    }else{
        resp.json({status: false, message: '用户名或密码错误'});
    }
});


api.get('/login/check', (req, resp, next) => {
    if(req.session.username && req.session.username != null && req.session.username != ""){
        resp.json({status:true});
    }else{
        resp.json({status:false});
    }   
});

api.get('/logout', (req, resp) => {
    req.session.username = null;
    delete(req.session, 'username');
    resp.json({status: true})
});




export {api};
