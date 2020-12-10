const {Student, validate}=require('../models/student');
const mongoose=require('mongoose');
const express=require('express');
const router=express();

router.get('/',async (req, res)=>{
    const students= await Student.find().sort('name');
    res.send(students);
});

router.post('/',async (req,res)=>{
    const {error}=validate(req.body);
    if(error){return res.status(400).send(error.details[0].message);}
    
    const student = new Student({
        isGold:req.body.isGold,
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone
    })
    await student.save();
    res.send(student);
});

router.put('/:id',async (req,res)=>{
    const {error}=validate(req.body);
    if(error){return res.status(400).send(error.details[0].message);}

    const student=await Student.findByIdAndUpdate(req.params.id,{$set:{
        isGold:req.body.isGold,
        name:req.body.name,
        phone:req.body.phone
    }},{new:true});

    if(!student)return res.status(404).send('The student with the given ID not found');
    res.send(student);
});

router.get('/:id',async (req,res)=>{
    const student = await Student.findById(req.params.id);
    if(!student)return res.status(404).send('The student with the given ID not found');
    res.send(student);
});

router.delete('/:id',async (req,res)=>{
    const student=await Student.findByIdAndDelete(req.params.id);
    if(!student)return res.status(404).send('The student with the given ID not found');
    res.send(student);
});


module.exports=router;