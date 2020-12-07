const Joi=require('joi');
const mongoose=require('mongoose');
const express =require('express');
const router=express.Router();


const Course = mongoose.model('Course', mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255
    }
}));


router.get('/',async(req,res)=>{
    const courses=await Course.find().sort('name');
    res.send(courses);
});

router.post('/',async(req,res)=>{
    const {error}=validateCourse(req.body);
    if(error)return res.status(400).send(error.details[0].message);

    let course= new Course({ name:req.body.name});

    course = await course.save();
    res.send(course);
});

router.put('/:id',async(req,res)=>{
    const {error}=validateCourse(req.body);//result.error
    if(error){return res.status(400).send(error.details[0].message);}

    const course=await Course.findByIdAndUpdate(req.params.id,{$set:{name:req.body.name}},{
        new:true
    });

    if(!course)return res.status(404).send('The course with the given ID not found');
    res.send(course);

});
router.get('/:id',async(req,res)=>{
    const course = await Course.findById(req.params.id)
    if(!course)return res.status(404).send('The course with the given ID not found');
    res.send(course);
});



router.delete('/:id',async(req,res)=>{
    const course= await Course.findByIdAndDelete(req.params.id);
    if(!course)return res.status(404).send('The course with the given ID not found');
    res.send(course);
});

function validateCourse(param){
    const schema=Joi.object({
        name:Joi.string().min(3).required()
    });
    return schema.validate(param);
}

module.exports=router;