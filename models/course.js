const Joi=require('joi');
const mongoose=require('mongoose');

const Course = mongoose.model('Course', mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255
    }
}));
function validateCourse(param){
    const schema=Joi.object({
        name:Joi.string().min(3).required()
    });
    return schema.validate(param);
}
exports.Course=Course
exports.validate=validateCourse