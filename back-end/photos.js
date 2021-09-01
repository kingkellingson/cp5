const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 50000000
  }
});

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;


const photoSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    path: String,
    title: String,
    description: String,
    ownComments: Array,
    created: {
      type: Date,
      default: Date.now
    },
  });
  
  const Photo = mongoose.model('Photo', photoSchema);
  

// upload photo
router.post("/", validUser, upload.single('photo'), async (req, res) => {
    // check parameters
    if (!req.file)
      return res.status(400).send({
        message: "Must upload a file."
      });
  
    const photo = new Photo({
      user: req.user,
      path: "/images/" + req.file.filename,
      title: req.body.title,
      description: req.body.description,
    });
    try {
      await photo.save();
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });
  

  // get my photos
router.get("/", validUser, async (req, res) => {
    // return photos
    try {
      let photos = await Photo.find({
        user: req.user
      }).sort({
        created: -1
      }).populate('user');
      return res.send(photos);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

// get all photos
router.get("/all", async (req, res) => {
    try {
      let photos = await Photo.find().sort({
        created: -1
      }).populate('user');
      return res.send(photos);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });
  

// get a single photo
router.get("/:id", async (req, res) => {
  try {
    let photo = await Photo.find()
    // console.log("1found: ", photo)
    let myPhoto = await Photo.find({
      _id: req.params.id
    }).populate('user');
    // console.log("2found: ", myPhoto)
    return res.send(myPhoto);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});
  

//////////////////////////////
///////////COMMENTS//////////
/////////////////////////////

// This is the schema for a ticket
const commentSchema = new mongoose.Schema({
  myUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  photo: {
      type: mongoose.Schema.ObjectId,
      ref: "Photo"
    },
  words: String,
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



//   create a comment on that specific photo
router.post("/:id/post", validUser, async (req, res) => {
  // check parameters
  if (!req)
    return res.status(400).send({
      message: "Must upload a file."
    });
  
  
  console.log("try photo: ", req.body.photo)

  let myComment = new Comment({
    myUser: req.user,//possibly an error here
    photo: req.body.photo,
    words: req.body.commentToAdd
  });

  // console.log("added comment: ", myComment)
  // console.log("with user: ", myComment.myUser)
  // console.log("with photo: ", myComment.photo)
  // console.log("______________________TEST!_______________________")

  // let myPhoto1 = await Photo.find().populate('user');
  // console.log("All found photos: ", myPhoto1)

  // let myPhoto2 = await Photo.find({
  //   _id: req.body.photo,
  // }).populate('user');
  // console.log("Found photo: ", myPhoto2)

  // console.log("______________________TEST!_______________________")
  // console.log("params: ", req.params.id)
  // console.log("body: ", req.body.photo)


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


// get comments -- will list comments for the specified photo
router.get("/:id/comment", validUser, async (req, res) => {
  let comments = [];
try {
  console.log("______________________TEST!_______________________")
  // console.log("request", req)
  comments1 = await Comment.find().sort({
      created: -1
  }).populate('myUser');
  console.log("all comments", comments1)

  console.log("searching with this: ",req.params.id )  
  comments = await Comment.find({
    photo: req.params.id
  }).sort({
      created: -1
  }).populate('myUser');
  console.log("get comments returned these comments: ", comments)

  return res.send({
      comments: comments
  });
} catch (error) {
  console.log(error);
  return res.sendStatus(500);
}
});



// delete all comments
router.delete("/cc", async (req, res) => {
  try {
    await Comment.deleteMany({})
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// delete all pictures
router.delete("/cp", async (req, res) => {
  try {
    await Photo.deleteMany({})
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get a single photo's comments



  module.exports = {
    model: Photo,
    routes: router,
  }

