const auth = require('../middleware/auth');
const {Course, validate}=require('../models/course');
const mongoose=require('mongoose');
const express =require('express');
const router=express.Router();

router.get('/', async(req,res)=>{
    const courses=await Course.find().sort('name');
    res.send(courses);
});

router.post('/', auth, async(req,res)=>{
    const {error}=validate(req.body);
    if(error)return res.status(400).send(error.details[0].message);

    const course= new Course({ name:req.body.name});

    await course.save();
    res.send(course);
});

router.put('/:id', auth, async(req,res)=>{
    const {error}=validate(req.body);//result.error
    if(error){return res.status(400).send(error.details[0].message);}

    const course=await Course.findByIdAndUpdate(req.params.id,{$set:{name:req.body.name}},{
        new:true});

    if(!course)return res.status(404).send('The course with the given ID not found');
    res.send(course);

});
router.get('/:id', async(req,res)=>{
    const course = await Course.findById(req.params.id)
    if(!course)return res.status(404).send('The course with the given ID not found');
    res.send(course);
});



router.delete('/:id',auth, async(req,res)=>{
    const course= await Course.findByIdAndDelete(req.params.id);
    if(!course)return res.status(404).send('The course with the given ID not found');
    res.send(course);
});
module.exports=router;