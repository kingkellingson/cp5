const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const question = require("./question.js");
const Question = question.model;

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const surveySchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    mytitle: String,
    questions : { type : Array , "default" : [] },
    results: { type : Array , "default" : [] },
  });
  
  const Survey = mongoose.model('Survey', surveySchema);

router.post('/create', validUser, async (req, res) => {
  console.log("Posting new survey"); 
  let questions = []; 
  console.log(req.body);
   
  for (let i = 0; i < req.body.questions.length; i++) {
    let question = new Question ({
      questionContent: req.body.questions[i],
      answerA: {
        answerContent: req.body.answersA[i],
        points: 0
      },
      answerB: {
        answerContent: req.body.answersB[i],
        points: 1
      },
      answerC: {
        answerContent: req.body.answersC[i],
        points: 2
      },
      answerD: {
        answerContent: req.body.answersD[i],
        points: 3
      }
    }); 
    questions.push(question); 
  }
  console.log(questions); 
  const survey = new Survey ({
    user: req.body.user,
    mytitle: req.body.title,
    questions: questions,
    results: req.body.results,
  });
  console.log(survey);
  try {
    await survey.save();
    res.send(survey);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

// Add Generated "Free" Survey to Database
router.post('/newSurvey', validUser, async (req, res) => {
  console.log("Calling Post");
  const survey = new Survey ({
    user: req.body.user,
    mytitle: "**Generated Survey**",
    results: [
      "You are a fun person to be around!",
      "You hate pancakes!", 
      "You like the Avengers!",
      "You can't make a decision!",
      "You are bored of writing surveys!"
    ],
    questions: [ 
      new Question ({
        questionContent: "What is your second favorite color?",
        answerA: {
            answerContent: "Yellow",
            points: 0
        },
        answerB: {
            answerContent: "Blue",
            points: 1
        },
        answerC: {
            answerContent: "Green",
            points: 2
        },
        answerD: {
            answerContent: "Red",
            points: 3
        }
      }),
      new Question ({
        questionContent: "What is your dream pet?",
        answerA: {
            answerContent: "Golden Retriever",
            points: 0
        },
        answerB: {
            answerContent: "Dolphin",
            points: 1
        },
        answerC: {
            answerContent: "Sloth",
            points: 2
        },
        answerD: {
            answerContent: "Lion",
            points: 3
        }
      }),
      new Question ({
        questionContent: "What is your favorite fast food item?",
        answerA: {
            answerContent: "French fries",
            points: 0
        },
        answerB: {
            answerContent: "Soda",
            points: 1
        },
        answerC: {
            answerContent: "Salad",
            points: 2
        },
        answerD: {
            answerContent: "Hamburger",
            points: 3
        }
      }),
      new Question ({
        questionContent: "Which element would you want to be able to bend?",
        answerA: {
            answerContent: "Air",
            points: 0
        },
        answerB: {
            answerContent: "Water",
            points: 1
        },
        answerC: {
            answerContent: "Earth",
            points: 2
        },
        answerD: {
            answerContent: "Fire",
            points: 3
        }
      }),
      new Question ({
        questionContent: "Into which house would you hope to be sorted?",
        answerA: {
            answerContent: "Hufflepuff",
            points: 0
        },
        answerB: {
            answerContent: "Ravenclaw",
            points: 1
        },
        answerC: {
            answerContent: "Slytherin",
            points: 2
        },
        answerD: {
            answerContent: "Gryffindor",
            points: 3
        }
      }),
      new Question ({
        questionContent: "Who is your favorite Marvel superhero?",
        answerA: {
            answerContent: "Captain America",
            points: 0
        },
        answerB: {
            answerContent: "Iron Man",
            points: 1
        },
        answerC: {
            answerContent: "Loki",
            points: 2
        },
        answerD: {
            answerContent: "Thor",
            points: 3
        }
      })
    ]
  });
  console.log(survey);
  console.log(survey.questions);
  console.log(survey.questions[0].answerA); 
  try {
    await survey.save();
    res.send(survey);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//get specific survey
router.get('/getSurvey/:id', async (req, res) => {
  try {
      //console.log("Getting answers back end"); 
      let answer = await Survey.findOne({
        _id: req.params.id
      }).populate('user');
      // console.log("Answer is: "); 
      // console.log(answer); 
      res.send(answer); 
      //res.sendStatus(200);
  } catch (error) {
    console.log(error);
    //res.sendStatus(500);
  }
});

// //get my surveys
// router.get('/getSurveys/my', async (req, res) => {
//   try {
//       let surveys = await Survey.find({
//         user: req.user
//       }).populate('user');
//       res.send(surveys); 
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// })

//get all surveys
router.get('/getSurveys', async (req, res) => {
  try {
      let surveys = await Survey.find().populate('user');
      res.send(surveys); 
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

router.put('/edit/:id', async (req, res) => {
  console.log("in edit function")
  try {
    let survey = await Survey.findOne({
      _id: req.params.id
    });

    let questions = []; 
    console.log(req.body);
      
    for (let i = 0; i < req.body.questions.length; i++) {
      let question = new Question ({
        questionContent: req.body.questions[i],
        answerA: {
          answerContent: req.body.answersA[i],
          points: 0
        },
        answerB: {
          answerContent: req.body.answersB[i],
          points: 1
        },
        answerC: {
          answerContent: req.body.answersC[i],
          points: 2
        },
        answerD: {
          answerContent: req.body.answersD[i],
          points: 3
        }
      }); 
      questions.push(question); 
    }
    console.log(questions); 
    survey.mytitle = req.body.title
    survey.questions = questions
    survey.results = req.body.results
    
    //Edit the survey here, like this
    //survey.title = req.body.title; 
    //Save the edited survey.
    await survey.save(); 
    res.sendStatus(200); 
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


router.delete('/delete', async (req, res) => {
  try {
    console.log("In All Delete");
    await Survey.deleteMany({});
    res.sendStatus(200);
  }
  catch {
    console.log(error);
    res.sendStatus(500);
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    // console.log("In Delete with id: ", req.params.id);
    await Survey.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = {
  routes: router,
  model: Survey,
};


