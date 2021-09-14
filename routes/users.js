var express = require('express');
var router = express.Router();
const User = require('../User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../auth');

/* GET users listing. */
router.post('/register', (req, res, next)=> {
  const user = new User({
    email: req.body.email
  });

  bcrypt.hash(req.body.password, 10, (error, hashedPassword)=> {
    if(error) {return next(error);}
    user.set('password', hashedPassword);
    user.save(error=> {
        if(error) {return next(error);}
        jwt.sign({user}, 'secretkey', {expiresIn: '1d'},(err,token)=>{
          res.json({
              token, user
          })
        });
    })
  });
});

router.post('/login', async (req, res, next)=> {
  passport.authenticate('login', {session: false}, async (err,user)=>{
    try {
        if(err || !user) {
            return next(err);
        }

        req.login(user, {session: false}, async(error)=>{
            if(error) return next(error);
            
            const body = {_id: user._id, email: user.email};
            const token = jwt.sign({ user: body }, 'secretkey', {expiresIn: '1d'});

            return res.json({ token, body });
        })
    } catch (error) {
        return next(error);
    }
  })(req, res, next);
});

module.exports = router;
