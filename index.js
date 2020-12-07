const mongoose=require('mongoose');
const debug=require('debug')('app:startup');
const config=require('config');
const morgan=require('morgan');
const helmet = require('helmet');
const auth=require('./middleware/auth');
const logger=require('./middleware/logger');
const home=require('./routes/home');
const courses=require('./routes/courses');
const students=require('./routes/students');
const express =require('express');
const app=express();

mongoose.connect('mongodb://localhost/vidlydb')
    .then(()=>console.log('connected to MongoDB...'))
    .catch(err=>console.error('Could not connect to MongoDB...',err));

app.set('view engine', 'pug');
app.set('views', './views');//default

//configuration
debug(`Application name: ${config.get('name')}`);
debug(`Mail Server: ${config.get('mail.host')}`);
debug(`Mail Password: ${config.get('mail.password')}`);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/',home);


app.use('/api/courses',courses);
app.use('/api/students',students);


if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    debug('Morgan enabled');
}
app.use(logger);
app.use(auth);


const port=Number(process.env.PORT||3000);
app.listen(port,()=>console.log(`Listening to port ${port}..`));
