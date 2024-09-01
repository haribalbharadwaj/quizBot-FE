import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import QuizPage from "./QuizPage/QuizPage";
import Analysis from "./Analysis";
import QuestionAnalysis from "./QuestionAnalysis"

function Home (){
    return(
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/quiz/:quizId' element={<QuizPage/>}/>
          <Route path="/quizzes" element={<Analysis/>}/>
          <Route path="/question-analysis/:id" element={<QuestionAnalysis/>}/>
        </Routes>
        
      </BrowserRouter>
       
    );
};

export default Home;