const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate,updateValidation} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => { //getting currently loggedIn user
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);//user_id was accessed from jwt not from external input
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

   const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', auth, async (req,res)=>{
  const { error } = updateValidation(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  const user=await User.findByIdAndUpdate(req.params.id,{$set:{name:req.body.name}},{new:true});
  
  if (!user) return res.status(404).send('The user with the given ID was not found.');
  res.send(_.pick(user,['_id', 'name', 'email']));


});

module.exports = router; 