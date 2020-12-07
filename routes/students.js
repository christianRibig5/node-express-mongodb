const Joi=require('joi');
const mongoose=require('mongoose');
const express=require('express');
const router=express();

const Student=mongoose.model('Student', new mongoose.Schema({
        isGold:{
            type:Boolean,
            required:true
        },
        name:{
            type:String,
            required:true,
            minlength:5,
            maxlength:50
        },
        email:{
            type:String,
            required:true,
            match:/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
        },
        phone:{
            type:String,
            required:true,
            minlength:11,
            maxlength:13
        }
}));



router.get('/',async (req, res)=>{
    const students= await Student.find().sort('name');
    res.send(students);
});

router.post('/',async (req,res)=>{
    const {error}=studentDetailValidation(req.body);
    if(error){return res.status(400).send(error.details[0].message);}
    
    let student = new Student({
        isGold:req.body.isGold,
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone
    })
    student= await student.save();
    res.send(student);
});

router.put('/:id',async (req,res)=>{
    const {error}=studentProfileUpdateValidation(req.body);
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



function studentDetailValidation(param){
    const schema=Joi.object({
        isGold:Joi.boolean().required(),
        name:Joi.string().min(5).required(),
        email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        phone:Joi.string().min(11).max(13).required()
    });
    return schema.validate(param);
}
function studentProfileUpdateValidation(param){
    const schema=Joi.object({
        isGold:Joi.boolean().required(),
        name:Joi.string().min(5).required(),
        phone:Joi.string().min(11).max(13).required()
    });
    return schema.validate(param);
}

module.exports=router;