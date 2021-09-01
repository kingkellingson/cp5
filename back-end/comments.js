const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const users = require("./users.js");

//
// Comments
//

const User = users.model;
const validUser = users.valid;


// This is the schema for a ticket
const commentSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: "Photo"
      },
    comment: String,
    created: {
      type: Date,
      default: Date.now
    },
  });


  // The model for a comment
const Comment = mongoose.model('Comment', commentSchema);


  //create a comment
// router.post('/', validUser, async (req, res) => {
    //check parameters
    // console.log("Received: ", req)
//   });



//   create a comment
router.post('/', validUser, async (req, res) => {
    // check parameters
    if (!req)
      return res.status(400).send({
        message: "Must upload a file."
      });
    
    const myComment = new Comment({
      user: req.body.photo.user,
      photo: req.body.photo,
      words: req.body.commentToAdd
    });
    console.log("added comment: ", myComment)
    console.log("with user: ", myComment.body.user)
    try {
      await myComment.save();
      return res.send({
        comment: myComment
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });


  // get comments -- will list tickets that a user has submitted
router.get('/', async (req, res) => {
    let comments = [];
  try {
    comments = await Comment.find().sort({
        created: -1
    }).populate('user');
    
    return res.send({
        comments: comments
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


module.exports = {
    model: Comment,
    routes: router,
  }






