<template>
<div class="home">
  <div class="menu" v-if="user">
    <p>Welcome!</p>
    <h2>{{user.firstName}} {{user.lastName}} <a @click="logout"><i class="fas fa-sign-out-alt"></i></a></h2>
  </div>
  <div class="surveyData">
    <h1>Choose a survey to edit or create a new survey.</h1>
    <br>
    <div class="suggestions" v-if="suggestions.length > 0">
    <div class="survey-options" v-for="survey in suggestions" :key="survey.id">
      <h2>{{survey.mytitle}}</h2>
      <button v-if="survey.user._id == user._id" @click="toggleEditSurvey(survey)" class="ui button" id="survey">Edit</button>
      <button v-if="survey.user._id == user._id" @click="deleteSurvey(survey)" class="ui button" id="survey-delete">Delete</button>
      <button v-else class="ui button" id="survey">Must be user "{{survey.user.firstName}}, {{survey.user.lastName}}" to Edit and Delete</button>
    </div>
    </div>
    <button @click="deleteAll" class="ui button" id="survey-delete">Delete All My Surveys</button>
    <button @click="generateSurvey" class="ui button">Generate Example Survey</button>
    <div class="createSurveyChoice">
      <button @click="createSurvey = true" class="ui button" id="survey-create">Create New Survey</button>
    </div> 
    <div class="createSurvey" v-if="createSurvey">
      <hr>
      <form id="createSurveyForm">
        <label for="title">Survey Title:  </label>
        <input type="text" id="title" name="title" value="Practice Survey"><br><br> 
      </form>
      <button @click="addQuestion" type="button" class="ui button" id="addQ">Add Question</button> <br><br>
      <form id="createSurveyFormPart2">
      </form>
      <button @click="addResult" type="button" class="ui button" id="addR">Add Result</button> <br><br>
      <button @click="postSurvey()" class="ui button" id="survey">Submit</button>
    </div>
  </div>
  <p v-if="error">{{error}}</p>
</div>
</template>


<script>
import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
      surveys: [],
      chosenSurvey: null,
      error: '',
      createSurvey: false,
      editSurveyBool: false,
      surveyToEditID: null,
      questions: [],
      questionsNum: 0,
      resultsNum: 0,
      lastSurveyEdited: null,
    }
  },
  async created() {
    this.getSurveys();
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    suggestions() {
      let items = this.surveys; 
      return items.sort((a, b) => a.title > b.title);
    },
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    async generateSurvey(){
        await axios.post("/api/survey/newSurvey");
        this.getSurveys();
      },
    async getSurveys() {
      try {
        console.log("Trying to get surveys"); 
        let response = await axios.get('/api/survey/getSurveys');
        console.log("GOT SURVEYS: ");
        console.log(response);
        this.surveys = response.data; 
        return true; 
      } catch (error) {
        console.log(error); 
        this.error = error.response.data.message;
      }
    },
    toggleEditSurvey(item) {
      if (this.lastSurveyEdited == item._id) {
        console.log("TRUE")
        this.postSurvey();
        this.lastSurveyEdited = null;
      }
      else {
        this.editSurvey(item);
        this.lastSurveyEdited = item._id;
      }
      
    },
    async editSurvey(item) {
      try {
        this.editSurveyBool = true;
        this.createSurvey = true;
        let surveyToEdit = await axios.get("/api/survey/getSurvey/" + item._id);
        let currentTitle = document.getElementById("title");
        console.log("current title is: ", currentTitle)
        let newTitle = surveyToEdit.data.title
        currentTitle.setAttribute("value", newTitle)

        this.deleteQuestionsToEdit();
        this.deleteResultsToEdit();

        this.resultsNum = surveyToEdit.data.results.length
        this.questionsNum = surveyToEdit.data.questions.length
        this.surveyToEditID = surveyToEdit.data._id
        console.log (surveyToEdit)
        this.addQuestionToEdit(surveyToEdit);
        console.log("Calling add result to edit")
        this.addResultToEdit(surveyToEdit);
        //reload surveys
        this.getSurveys();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteAll() {
      try {
        console.log("All Delete called");
        await axios.delete("/api/survey/delete");
        console.log("All Delete almost finished"); 
        this.getSurveys();
        console.log("All Delete successful"); 
        return true;
      } catch (error) {
        console.log("Error in all delete!"); 
        console.log(error);
      }
    },
    async deleteSurvey(item) {
      try {
        await axios.delete("/api/survey/delete/" + item._id);
        this.getSurveys();
        return true;
      } catch (error) {
        console.log("Error in delete!"); 
        console.log(error);
      }
    },
    async postSurvey() {
      console.log("In post survey"); 
      let newTitle = document.getElementById("title").value;

      let questionsContent = [];
      let answersA = [];
      let answersB = [];
      let answersC = [];
      let answersD = [];
      let results = [];
      for (let i = 1; i < this.questionsNum + 1; i++) {
        //console.log("Look here: " + document.getElementById("questionContent" + i).value);
        questionsContent.push(document.getElementById("questionContent" + i).value);
        answersA.push(document.getElementById("answerA" + i).value);
        answersB.push(document.getElementById("answerB" + i).value);
        answersC.push(document.getElementById("answerC" + i).value);
        answersD.push(document.getElementById("answerD" + i).value);
      }

      console.log("after for loop"); 
      for (let i = 1; i < this.resultsNum + 1; i++) {
        results.push(document.getElementById("resultContent" + i).value);
      }
      try {
        console.log("before axios"); 
        if (this.editSurveyBool) {
            console.log(this.surveyToEditID); 
            await axios.put('/api/survey/edit/' + this.surveyToEditID, {
            title: newTitle,
            questions: questionsContent,
            answersA: answersA,
            answersB: answersB,
            answersC: answersC,
            answersD: answersD,
            results: results,
            user: this.$root.$data.user,
          });
        }
        else {
          console.log("USER is: ");
          console.log(this.$root.$data.user);
          await axios.post('/api/survey/create', {
            title: newTitle,
            questions: questionsContent,
            answersA: answersA,
            answersB: answersB,
            answersC: answersC,
            answersD: answersD,
            results: results,
            user: this.$root.$data.user,
          });
        }
        console.log("after axios"); 
        
        this.createSurvey = false;
        this.editSurveyBool = false;
        this.questionsNum = 0;
        this.resultsNum = 0; 

        this.getSurveys();
      } catch (error) {
        console.log("postSurvey error");
        console.log(error);
      }

      
    },

    addQuestion() { 
      this.questionsNum++; 
      let form = document.getElementById("createSurveyForm");
      // Create an input element for Full Name
      var qiLabel = document.createElement("label");
      qiLabel.setAttribute("id", "questionLabel" + this.questionsNum);  
      qiLabel.innerText = "Question " + this.questionsNum + ": "; 
      var qi = document.createElement("input");
      qi.setAttribute("type", "text");
      qi.setAttribute("name", "questionContent");
      qi.setAttribute("id", "questionContent" + this.questionsNum);
      qi.setAttribute("size", 50);
      qi.setAttribute("placeholder", "What's your favorite color?");

      form.appendChild(qiLabel); 
      form.appendChild(document.createElement("br")); 
      form.appendChild(qi);
      form.appendChild(document.createElement("br")); 
      document.getElementById("questionLabel" + this.questionsNum).style.marginTop = "20px";
      document.getElementById("questionContent" + this.questionsNum).style.marginBottom = "20px";
      let options = ["A", "B", "C", "D"];
      let placeholders = ["Red", "Yellow", "Blue", "Green"];
      for (let i = 0; i < options.length; i++) {
        var answerLabel = document.createElement("label");
        answerLabel.innerText = "Answer " + options[i]; 
        var ai = document.createElement("input");
        ai.setAttribute("type", "text");
        ai.setAttribute("name", "answer" + options[i]);
        ai.setAttribute("id", "answer" + options[i] + this.questionsNum);
        ai.setAttribute("size", 50); 
        ai.setAttribute("placeholder", placeholders[i]); 
        form.appendChild(answerLabel);
        form.appendChild(document.createElement("br")); 
        form.appendChild(ai); 
        form.appendChild(document.createElement("br")); 
        document.getElementById("answer" + options[i] + this.questionsNum).style.marginBottom = "20px";
      }
    }, 
    addResult() {
      this.resultsNum++;
      let form = document.getElementById("createSurveyFormPart2");
      // Create an input element for Full Name
      var resultLabel = document.createElement("label");
      resultLabel.setAttribute("id", "resultLabel" + this.resultsNum);  
      resultLabel.innerText = "Result " + this.resultsNum + ": "; 
      var ri = document.createElement("input");
      ri.setAttribute("type", "text");
      ri.setAttribute("name", "resultContent");
      ri.setAttribute("id", "resultContent" + this.resultsNum);
      ri.setAttribute("size", 50);
      ri.setAttribute("placeholder", "Your spirit animal is a fox.");
      form.appendChild(resultLabel); 
      form.appendChild(document.createElement("br")); 
      form.appendChild(ri);
      form.appendChild(document.createElement("br")); 
      document.getElementById("resultLabel" + this.resultsNum).style.marginTop = "20px";
      document.getElementById("resultContent" + this.resultsNum).style.marginBottom = "20px";
    },

    addQuestionToEdit(item) {  
      let form = document.getElementById("createSurveyForm");
      // Create an input element for Full Name
      
      for (let i = 0; i < this.questionsNum; ++i) {
        console.log("index is",i)
        var qiLabel = document.createElement("label");
        qiLabel.setAttribute("id", "questionLabel" + (i+1));  
        qiLabel.innerText = "Question " + (i+1) + ": "; 
        var qi = document.createElement("input");
        qi.setAttribute("type", "text");
        qi.setAttribute("name", "questionContent");
        qi.setAttribute("id", "questionContent" + (i+1));
        qi.setAttribute("size", 50);
        qi.setAttribute("value", item.data.questions[i].questionContent);
        form.appendChild(qiLabel); 
        var br1 = document.createElement("br")
        br1.setAttribute("id", "break" + (i+1) + 1)
        form.appendChild(br1); 
        form.appendChild(qi);
        var br2 = document.createElement("br")
        br2.setAttribute("id", "break" + (i+1) + 2)
        form.appendChild(br2); 
        document.getElementById("questionLabel" + (i+1)).style.marginTop = "20px";
        document.getElementById("questionContent" + (i+1)).style.marginBottom = "20px";
        //this is for the individual answers
        let options = ["A", "B", "C", "D"];
        //let placeholders = ["Red", "Yellow", "Blue", "Green"];
        for (let j = 0; j < options.length; j++) {
          var answerLabel = document.createElement("label");
          answerLabel.innerText = "Answer " + options[j]; 
          answerLabel.setAttribute("id", "answerLabel" + options[j] + (i+1));
          var ai = document.createElement("input");
          ai.setAttribute("type", "text");
          ai.setAttribute("name", "answer" + options[j]);
          ai.setAttribute("id", "answer" + options[j] + (i+1));
          ai.setAttribute("size", 50); 
          ai.setAttribute("value", item.data.questions[i]["answer" + options[j]].answerContent); 
          form.appendChild(answerLabel);
          var brj1 = document.createElement("br")
          brj1.setAttribute("id", "break" + options[j] + (i+1) + 1)
          form.appendChild(brj1); 
          form.appendChild(ai); 
          var brj2 = document.createElement("br")
          brj2.setAttribute("id", "break" + options[j] + (i+1) + 2)
          form.appendChild(brj2); 
          document.getElementById("answer" + options[j] + (i+1)).style.marginBottom = "20px";
        }
      }
    }, 

    deleteQuestionsToEdit() {  
      let form = document.getElementById("createSurveyForm");
      // Create an input element for Full Name
      for (let i = 0; i < this.questionsNum; ++i) {
        console.log("index is",i)
        let qilabelToDelete = document.getElementById("questionLabel"+(i+1));
        let qiToDelete = document.getElementById("questionContent"+(i+1));
        let br1ToDelete = document.getElementById("break"+(i+1)+1);
        let br2ToDelete = document.getElementById("break"+(i+1)+2);
    
        form.removeChild(qilabelToDelete);
        form.removeChild(qiToDelete);
        form.removeChild(br1ToDelete);
        form.removeChild(br2ToDelete);
        //this is for the individual answers
        let options = ["A", "B", "C", "D"];
        //let placeholders = ["Red", "Yellow", "Blue", "Green"];
        for (let j = 0; j < options.length; j++) {
          let answerLabel = document.getElementById("answerLabel" + options[j] + (i+1));
          let ai = document.getElementById("answer" + options[j] + (i+1));
          let brj1ToDelete = document.getElementById("break" + options[j] + (i+1) + 1);
          let brj2ToDelete = document.getElementById("break" + options[j] + (i+1) + 2);
          
          form.removeChild(answerLabel);
          form.removeChild(ai);
          form.removeChild(brj1ToDelete);
          form.removeChild(brj2ToDelete);
        }
      }
    },

    addResultToEdit(item) {
      let form = document.getElementById("createSurveyFormPart2");
      // Create an input element for Full Name

      for (let i = 0; i < this.resultsNum; i++) {
        var resultLabel = document.createElement("label");
        resultLabel.setAttribute("id", "resultLabel" + (i+1));  
        resultLabel.innerText = "Result " + (i+1) + ": "; 
        var ri = document.createElement("input");
        ri.setAttribute("type", "text");
        ri.setAttribute("name", "resultContent");
        ri.setAttribute("id", "resultContent" + (i+1));
        ri.setAttribute("size", 50);
        ri.setAttribute("value", item.data.results[i]);
        form.appendChild(resultLabel); 
        var rbr1 = document.createElement("br")
        rbr1.setAttribute("id", "rbreak" + (i+1) + 1)
        form.appendChild(rbr1);  
        form.appendChild(ri);
        var rbr2 = document.createElement("br")
        rbr2.setAttribute("id", "rbreak" + (i+1) + 2)
        form.appendChild(rbr2);   
        document.getElementById("resultLabel" + (i+1)).style.marginTop = "20px";
        document.getElementById("resultContent" + (i+1)).style.marginBottom = "20px";
      }
    },
    deleteResultsToEdit() {
      let form = document.getElementById("createSurveyFormPart2");
      // Create an input element for Full Name

      for (let i = 0; i < this.resultsNum; i++) {
        let resultLabelToDelete = document.getElementById("resultLabel" + (i+1));
        let riToDelete = document.getElementById("resultContent" + (i+1));
        let rbr1ToDelete = document.getElementById("rbreak" + (i+1) + 1);
        let rbr2ToDelete = document.getElementById("rbreak" + (i+1) + 2);
    
        form.removeChild(resultLabelToDelete);
        form.removeChild(riToDelete);
        form.removeChild(rbr1ToDelete);
        form.removeChild(rbr2ToDelete);
      }
    },
  }

}
</script>


<style scoped>

.home {
  padding: 120px;
  /* display: flex; */
  justify-content: center;
}

.surveyData {
  display: flex;
  flex-wrap: wrap; 
  flex-direction: column;
  justify-content: center;
  align-items: center; 
}

.survey-options {
  display: flex;
  align-items: left; 
  justify-content: space-between; 
}

.survey-create {
  margin: 10px; 
  margin-top: 20px; 
  margin-bottom: 20px; 
}

#survey-create {
  background-color: #F7B733; 
}

#survey-delete:hover {
  background-color: #FC4A1A; 
}

h1 {
  color: black;
  font-size: 20px;
}

 .ui.button:focus{
  background-color:#4ABDAC; 
  color: black; 
} 

.ui.button {
  margin: 10px; 
}

.menu {
  display: flex;
  justify-content: space-between;
}

.menu h2 {
  font-size: 14px;
}

h2 {
  font-size: 14px;
  padding-top: 10px; 
  padding-right: 15px; 
}

hr {
  margin: 25px;   
}

br {
  padding: 50px; 
}

form {
  margin: 10px;
  padding: 10px; 
}

label {
  margin-right: 10px; 
}
</style>