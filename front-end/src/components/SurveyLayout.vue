<template>

<div class="surveyHolder">

  <h2>Choose a survey to take:</h2>
  <div class="survey-chooser">
  <div class="survey-options" v-for="survey in surveys" :key="survey.id">
    <button @click="chooseSurvey(survey)" class="ui button" id="survey-choice">{{survey.title}}</button>
  </div>
  <hr>
  </div>

  <div class="ui container" v-if="chosenSurvey">
    <div class="main-container">
        <div class="left-container">
            <h2 id="show-counter"></h2>
            <p id="show-data">{{chosenSurvey.questions[questionNum].questionContent}}</p>
        </div>

        <div class="right-container">
            <button @click="updatePoints(chosenSurvey.questions[questionNum].answerA.points)" class="ui button survey-button" id="answer1">{{chosenSurvey.questions[questionNum].answerA.answerContent}}</button>
            <button @click="updatePoints(chosenSurvey.questions[questionNum].answerB.points)" class="ui button survey-button" id="answer2" >{{chosenSurvey.questions[questionNum].answerB.answerContent}}</button>
            <button @click="updatePoints(chosenSurvey.questions[questionNum].answerC.points)" class="ui button survey-button" id="answer3">{{chosenSurvey.questions[questionNum].answerC.answerContent}}</button>
            <button @click="updatePoints(chosenSurvey.questions[questionNum].answerD.points)" class="ui button survey-button" id="answer4">{{chosenSurvey.questions[questionNum].answerD.answerContent}}</button>

        </div>
    </div>
    <br>
    <div class="navigation-controllers">
        <button @click="decrementQuestionNum" class="ui icon button left-arrow" id="prev-data">
            <i class="ui icon arrow left"></i>
        </button>
        <button @click="incrementQuestionNum" class="ui icon button right-arrow" id="next-data">
            <i class="ui icon arrow right"></i>
        </button>
        <br>
        <button @click="submitSurvey" v-if="isLastQuestion" class="ui icon button" id="review-data">
            Submit
        </button>

    </div>

    <div class="result-output">
      <h2>Result: {{result}}</h2>
    </div>
  </div>
</div>

</template>


<script>
import axios from 'axios';
export default {
  name: 'SurveyLayout',
  
  data() {
    return {
      questionNum: 0,
      totalQuestions: 0, 
      id: '',
      surveys: [],
      chosenSurvey: null,
      answer: null, 
      answersPoints: [],
      result: null,
    }//test
  },
  created() {
    this.getSurveys();
    
  },
  computed:{
    isLastQuestion () {
      return this.questionNum == this.totalQuestions-1;
    },
    resultCalculated () {
      return this.result != null; 
    }
  },
  methods: {
    incrementQuestionNum () {
      this.result = null;
      console.log("You clicked next!"); 
      if (this.questionNum < this.totalQuestions - 1) {
        this.questionNum++;
      }
    },
    decrementQuestionNum () {
      this.result = null;
      console.log("You clicked previous!"); 
      if (this.questionNum > 0) {
        this.questionNum--; 
      }
      
    },
    updatePoints (points) {
      this.result = null; 
      this.answersPoints[this.questionNum] = points;  
    },
    submitSurvey() {
      var sum = this.answersPoints.reduce(function(a,b){return a + b;}, 0)
      console.log("Sum is: ", sum)
      let possibleResults = this.chosenSurvey.results; 
    
      //Let's say there are five questions
      let highestPossible = this.totalQuestions * 3; 
      //hP = 15
      //let result = "";

      for (let i = 0; i < possibleResults.length; i++) {
        //let upperBound = highestPossible / this.totalQuestions * (i+1); 
        let upperBound = highestPossible / possibleResults.length * (i+1); 
        if (sum <= upperBound) {
          this.result = possibleResults[i];
          console.log(this.result); 
          return; 
        }
      }
    },
    async chooseSurvey(item) {
      this.result = null;
      try {
        console.log("Getting one survey");
        let response = await axios.get('/api/survey/getSurvey/' + item._id);
        this.chosenSurvey = response.data; 
        this.totalQuestions = response.data.questions.length; 
        for (let i = 0; i < response.data.questions.length; i++) {
          this.answersPoints.push(0); 
        }
        console.log(response.data); 
      } catch (error) {
        console.log(error); 
        this.error = error.response.data.message; 
      }
    },
    async getSurveys() {
      try {
        console.log("Trying to get surveys"); 
        let response = await axios.get('/api/survey/getSurveys');
        this.surveys = response.data;  
        return true; 
      } catch (error) {
        console.log(error); 
        this.error = error.response.data.message;
      }
    },
    async getAnswer(answerID) {
      try {
        console.log("Trying to get answers");
        let response = await axios.get("/api/survey/" + answerID);
        this.answer = response.data; 
        console.log(response.data); 
        return true;
      } catch (error) {
        console.log(error); 
        this.error = error.response.data.message;
      }
    },
    async register() {
      this.error = '';
      this.errorLogin = '';
      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;
      try {
        let response = await axios.post('/api/users', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async login() {
      this.error = '';
      this.errorLogin = '';
      if (!this.usernameLogin || !this.passwordLogin)
        return;
      try {
        let response = await axios.post('/api/users/login', {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
    },

  }

}
</script>


<style scoped>
.space-above {
  margin-top: 50px;
}

h1 {
  font-size: 28px;
  font-variant: capitalize;
}

h2 {
  font-size: 18px; 
}


.surveyHolder {
  padding: 120px;
  /* display: flex; */
  justify-content: center;
}

@media screen and (max-width: 1100px) {
  .surveyHolder {
    padding: 20px;
    padding-top: 120px;
  }
}

.survey-chooser {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px; 
  justify-content: center; 
  flex-wrap: wrap; 
  
}

#survey-choice {
  text-align: center;
  margin: 10px; 
}

.ui.button:focus{
  background-color:#4ABDAC; 
  color: black; 
} 

.hero form {
  font-size: 14px;
}

.hero form legend {
  font-size: 20px;
}

input {
  margin-right: 10px;
}

.answer {
  display: flexbox;
  justify-content: left;
  text-align: left;
}

.error {
  margin-top: 10px;
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 10px;
  background-color: #d9534f;
  color: #fff;
}

body {
    height: 100%;
    background-color: #201f22;
    background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23575a61' fill-opacity='0.43' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
}

.ui.container {
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    height: 100%;
}

.main-container {
    padding: 30px;
    display: flex;
    flex-direction: row;
    border: none;
    border-radius: .28571429rem;
    /* box-shadow: 0 1px 3px 0 #D4D4D5, 0 0 0 1px #D4D4D5; */
    box-shadow: 0 1px 3px 0 #4ABDAC, 0 0 0 1px #4ABDAC;
    background: white;
}

.left-container {
    width: 50%;
    padding: 10px;
}

.left-container > h2 {
    color: #2185D0;
}

.right-container {
    width: 50%;
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.right-container > button {
    margin-bottom: 15px !important;
}

.navigation-controllers {
    text-align: right;
}

#review-data {
  margin-top: 10px;
  background-color: #F7B733;
}

#review-data:hover {
  background-color: #F7B733;
}

#review-data:focus {
  background-color: #FC4A1A;
}

@media screen and (min-width: 1200px) {
    .ui.container {
        width: 900px;
    }
}

</style>

