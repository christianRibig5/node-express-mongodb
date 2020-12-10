const Joi = require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const mongoose=require('mongoose');
const debug=require('debug')('NodeExpressMongoDbApp');
const config=require('config');
const morgan=require('morgan');
const helmet = require('helmet');
const home=require('./controllers/home');
const auth=require('./controllers/auth');
const users=require('./controllers/users');
const courses=require('./controllers/courses');
const students=require('./controllers/students');
const genres = require('./controllers/genres');
const customers = require('./controllers/customers');
const movies = require('./controllers/movies');
const rentals = require('./controllers/rentals');
const express =require('express');
const app=express();

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR : jwtPrivateKey is not defined');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidlydb')
    .then(()=>console.log('connected to MongoDB...'))
    .catch(err=>console.error('Could not connect to MongoDB...',err));

app.set('view engine', 'pug');
app.set('views', './views');//default
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/',home);
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    debug('Morgan enabled');
}

app.use('/api/auth',auth);
app.use('/api/users', users);
app.use('/api/courses',courses);
app.use('/api/students',students);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);



const port=Number(process.env.PORT||3000);
app.listen(port,()=>console.log(`Listening to port ${port}..`));
