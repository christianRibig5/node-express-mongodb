
const Joi=require('joi');
const mongoose=require('mongoose');

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
    },
    phone:{
        type:String,
        required:true,
        minlength:11,
        maxlength:13
    }
}));

function validateStudent(param){
    const schema=Joi.object({
        isGold:Joi.boolean().required(),
        name:Joi.string().min(5).required(),
        email:Joi.string().required().email(),
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

exports.Student=Student
exports.validate=validateStudent
