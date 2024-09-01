import React, { useState, useRef } from 'react';
// Import any necessary components and images
import Hz from '../assets/Hz.png'
import Delete from '../assets/delete.png'
import axios from 'axios';
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Edit from "../assets/Edit.png";
import Share from "../assets/Share.png";

const Analysis = () => {
  // State and ref variables
  const [isCreateQuizkVisible, setIsCreateQuizkVisible] = useState(false);
  const [qAQuestion,setQAQuestion]=useState('');
  const [pollQuestion,setPollQuestion] = useState('');
  const [isQABlockVisible,setIsQABlockVisible]= useState(false);
  const [isPollBlockVisible,setIsPollBlockVisible]= useState(false);
  const [quizName, setQuizName] = useState('');
  const [clickedButton, setClickedButton] = useState(null);
  const [circles, setCircles] = useState([{ number: 1 }]);
  const [currentCircleIndex, setCurrentCircleIndex] = useState(0);
  const [inputs, setInputs] = useState([
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' }
      ]);
  const [options, setOptions] = useState([
    { label: 'Text', hasDot: true },
    { label: 'Image',  hasDot: true },
    { label: 'Text-Image', hasDot: true }
]);
  const [selectedDot, setSelectedDot] = useState(0);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
 // const [error, setError] = useState({});
 
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditBlockVisible, setIsEditBlockVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [isPublishedVisible,setIsPublishedVisible] = useState(false);
  const [topPosition, setTopPosition] = useState(300);
  const [createdQuizId, setCreatedQuizId] = useState(null);
  const [editQuizType, setEditQuizType] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isScorePage,setIsScorePage]= useState(false);
  const [timer, setTimer] = useState(null); // State for managing the timer
  const [timerOption, setTimerOption] = useState('off');
  const [inputVisibilityState, setInputVisibilityState] = useState(false);
  


  const navigate = useNavigate();
  const [error, setError] = useState({
    quizName: false,
    qAQuestion:false,
    pollQuestion:false

})


  // Event handler functions
  const handleAnalysis =()=>{
    navigate('/quizzes');
  };

  const handleCopyLink = () => {
    const quizLink = `${window.location.origin}/quiz/${createdQuizId}`;
    navigator.clipboard.writeText(quizLink)
      .then(() => {
        alert('Quiz link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy the link: ', err);
      });
  };

  
  
  const handleInputsBlock = ()=>{
    if(clickedButton==='qna'){
      setIsQABlockVisible(true);
      setIsPollBlockVisible(false);
      
      console.log('type:', clickedButton);
    }
    else if(clickedButton==='poll'){
      setIsPollBlockVisible(true);
      setIsQABlockVisible(false);
     
      console.log('type:', clickedButton);
    }
  }

  console.log('Current clickedButton:', clickedButton);


  const closePollBlock =()=>{
    setIsPollBlockVisible(false);
  }

  const handleDeleteOption = (index) => {
    const newInputs = [...inputs];
  newInputs.splice(index, 1);
  setInputs(newInputs);
  if (correctAnswerIndex === index) {
    setCorrectAnswerIndex(null); // Reset correct answer if deleted
  } else if (correctAnswerIndex > index) {
    setCorrectAnswerIndex(correctAnswerIndex - 1); // Adjust index if needed
  }
};

useEffect(() => {
  console.log("Input visibility state:", inputVisibilityState);
}, [inputVisibilityState]);



const handleSelectCorrectAnswer = (index) => {
  setCorrectAnswerIndex(index); // Set the selected option as the correct answer
};


const handleInputChange = (index, e, type) => {
  const updatedInputs = [...inputs];
  if (type === 'text') {
    updatedInputs[index].text = e.target.value;
  } else if (type === 'imageUrl') {
    updatedInputs[index].imageUrl = e.target.value;
  }
  setInputs(updatedInputs);
};

const handleAddOption = () => {
  const newInput = {};
  if (selectedDot === 0) {
    // Text option selected
    newInput.text = '';
  } else if (selectedDot === 1) {
    // Image option selected
    newInput.imageUrl = '';
  } else if (selectedDot === 2) {
    // Text and Image option selected
    newInput.text = '';
    newInput.imageUrl = '';
  }
  setInputs([...inputs, newInput]);
};


const handleDotClick = (index) => {
  setSelectedDot(index); // Update the selected dot state

  // Set up inputs based on the selected dot
  let newInputs = [];
  if (index === 0) {
     newInputs = [{ text: '' },
      { text: '' },
      { text: '' },
      { text: '' }
     ]  // Text option
  } else if (index === 1) {
      newInputs = [{ imageUrl: '' },
        { imageUrl: '' },
        { imageUrl: '' },
        { imageUrl: '' }
      ]; // Image option
  } else if (index === 2) {
      newInputs = [{ text: '', imageUrl: '' },
        { text: '', imageUrl: '' },
        { text: '', imageUrl: '' },
        { text: '', imageUrl: '' }
      ]; // Text and Image option
  }
  setInputs(newInputs);
};

 

  const handleSaveQuestion = () => {
    if (!qAQuestion && !pollQuestion) {
        setError(prevError => ({ ...prevError, qAQuestion: !qAQuestion, pollQuestion: !pollQuestion }));
        return;
    }

    const updatedCircles = [...circles];

    let timerValue = timerOption === 'off' ? 0 : timer; 
      

    if (qAQuestion) {
      updatedCircles[currentCircleIndex] = {
          number: currentCircleIndex + 1,
          questionData: {
              type: 'QA',  // This sets the question type as 'QA'
              question: qAQuestion,
              options: inputs,
              correctAnswerIndex: correctAnswerIndex,
              timer: timerValue 
          }
      };
  } else if (pollQuestion) {
      const pollOptions =  [
        { text: 'Option 1', value: inputs[0]?.text || '' },
        { text: 'Option 2', value: inputs[1]?.text || '' },
        { text: 'Option 3', value: inputs[2]?.text || '' },
        { text: 'Option 4', value: inputs[3]?.text || '' },
    ];

    
    updatedCircles[currentCircleIndex] = {
      number: currentCircleIndex + 1,
      questionData: {
          type: 'Poll',  // This sets the question type as 'Poll'
          question: pollQuestion,
          options: pollOptions,
      }
  };
}

//  updatedCircles[currentCircleIndex] = questionData;

  setCircles(updatedCircles);
  console.log('Question saved:', updatedCircles[currentCircleIndex]);
  setQAQuestion('');
  setPollQuestion('');
  setInputs([]);
  setCorrectAnswerIndex(null);
}





  const closeQAblock =()=>{
    setIsQABlockVisible(false);
  }

  const closePublishBlock =()=>{
    setIsPublishedVisible(false);
  }

  const handleQuizName = async () => {
    const newError = { quizName: !quizName };
    setError(newError);

    if (Object.values(newError).includes(true)) {
        console.log("Error exists in the form");
        return;
    }

    const quizData = {
        quizName,
        questions: circles.map(circle => {
            const questionType = circle.questionData.type;  // This should match the clickedButton
            console.log(`Question: ${circle.questionData.question}, Type: ${questionType}`);  // Log each question's type
            console.log("Question Type:", circle.questionData.type);

            return {
                questionText: circle.questionData.question,
                options: circle.questionData.options,
                correctAnswerIndex: circle.questionData.correctAnswerIndex,
                questionType: clickedButton.charAt(0).toUpperCase() + clickedButton.slice(1) ,
                timer: circle.questionData.timer || 0   
            };
        })
    };

    console.log("Quiz Data before sending:", quizData);

    

    try {
        const backendUrl = process.env.REACT_APP_QUIZBOT_BACKEND_URL;
        if (!backendUrl) {
            throw new Error('Backend URL is not defined');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found in localStorage');
        }

        const response = await axios.post(`${backendUrl}/quiz/createQuiz`, quizData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('Response data:', response.data);
        console.log("Quiz data sent:", quizData);  // Re-log the quizData sent for verification

        const createdQuizId = response.data.quiz._id;
        if (createdQuizId) {
            setCreatedQuizId(createdQuizId);
            console.log('createdQuizId:', createdQuizId);
            localStorage.setItem('quizId', createdQuizId);
            console.log('Quiz ID stored in localStorage:', createdQuizId);
        } else {
            console.error('Quiz ID not found in response');
        }

        setIsPublishedVisible(true);
        console.log('Form submitted successfully', response.data);

        if (clickedButton === 'qna') {
            setIsQABlockVisible(true);
            setIsPollBlockVisible(false);
        } else if (clickedButton === 'poll') {
            setIsPollBlockVisible(true);
            setIsQABlockVisible(false);
        }

        closeCreateQuiz();
        setError({ quizName: false });
        setQuizName('');
        setCircles([{ number: 1, questionData: { question: '', options: [] } }]);
        setInputs([]);
        setQAQuestion('');
        setPollQuestion('');
        setCorrectAnswerIndex(null);

    } catch (error) {
        console.error('Error creating quiz', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            setError({ ...error, global: `Failed to create quiz: ${error.response.data.message || 'Please try again.'}` });
        } else if (error.request) {
            console.error('Request data:', error.request);
            setError({ ...error, global: 'No response received from the server. Please try again.' });
        } else {
            console.error('Error message:', error.message);
            setError({ ...error, global: `Failed to create quiz: ${error.message}. Please try again.` });
        }
    }
};

  const createQuiz = () => {
    setIsCreateQuizkVisible(true);
};

const closeCreateQuiz = ()=>{
    setIsCreateQuizkVisible(false);
}

const addCircle = () => {
  // Preserve the current circle's question and options before adding a new one
  const updatedCircles = [...circles];
  updatedCircles[currentCircleIndex] = {
    number: circles[currentCircleIndex].number,
    questionData: {
      question: pollQuestion,
      options: inputs,
      correctAnswerIndex
    }
  };
  
  // Add the new circle
  const newCircle = { number: circles.length + 1, questionData: { question: '', options: [] } };
  setCircles([...updatedCircles, newCircle]);
  setCurrentCircleIndex(circles.length);  // Update the current circle index
  setQAQuestion('');  // Clear input boxes
  setPollQuestion('');
  setInputs([]);       // Clear options
  setCorrectAnswerIndex(null); // Clear correct answer selection
};

const handleCircleClick = (index) => {
  setCurrentCircleIndex(index);
  const circle = circles[index];
  setCurrentCircleIndex(index);
    setQAQuestion(circle.questionData.question);
    setPollQuestion(circle.questionData.question);
    setInputs(circle.questionData.options || []);
    setCorrectAnswerIndex(circle.questionData.correctAnswerIndex || null);
  
};



  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in localStorage');
        }

        const backendUrl = process.env.REACT_APP_QUIZBOT_BACKEND_URL;
        const response = await axios.get(`${backendUrl}/quiz/quizzes`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        setQuizzes(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching quizzes');
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  


  
  const popupRef = useRef(null);
  const logoutHandler = () => {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
     navigate('/');
  };

  const handleEditClick = async (quizId) => {
  
  try {
    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_QUIZBOT_BACKEND_URL;
    const response = await axios.get(`${backendUrl}/quiz/quiz/${quizId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    setCurrentQuiz(response.data);
    setEditQuizType(response.data.quizType); // Assume `quizType` determines Q&A or Poll
    console.log('Currentquiz',response.data);
    setIsEditBlockVisible(true);
  } catch (error) {
    console.log('Error',error);
    setError('Error fetching quiz data');
  }
};

const handleCloseEditBlock = () => {
  setIsEditBlockVisible(false);
  setCurrentQuiz(null);
};

const handleUpdateQuiz = async (quizId) => {
  try {
    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_QUIZBOT_BACKEND_URL;

    await axios.put(`${backendUrl}/quiz/updateQuiz/${quizId}`, currentQuiz, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Refresh quizzes after update
    const response = await axios.get(`${backendUrl}/quiz/quizzes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setQuizzes(response.data);
    console.log('Quiz data',response.data);
    handleCloseEditBlock();
  } catch (error) {
    setError('Error updating quiz');
  }
};


const handleDeleteClick = (quizId) => {
  setQuizToDelete(quizId);  // Correctly set the quiz ID
  setIsDeleteDialogVisible(true);
};

const handleConfirmDelete = async () => {
  if (!quizToDelete) return;  // Ensure a quiz ID is set before proceeding

  try {
    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_QUIZBOT_BACKEND_URL;

    console.log('Quiz ID to delete:', quizToDelete)

    // Send DELETE request to backend with correct quiz ID
    await axios.delete(`${backendUrl}/quiz/deleteQuiz/${quizToDelete}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Fetch updated quizzes after deletion
    const response = await axios.get(`${backendUrl}/quiz/quizzes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setQuizzes(response.data);  // Update the quizzes state with the latest data
    setIsDeleteDialogVisible(false);
    setQuizToDelete(null);  // Reset the quiz to delete state
  } catch (error) {
    console.error('Error deleting quiz:', error);
    setError('Error deleting quiz');
  }
};

const handleCancelDelete = () => {
  setIsDeleteDialogVisible(false);
  setQuizToDelete(null);
};

const handleShareClick = (quizId) => {
  const quizUrl = `${window.location.origin}/quiz/${quizId}`;
  navigator.clipboard.writeText(quizUrl)
    .then(() => alert('Quiz link copied to clipboard!'))
    .catch(() => alert('Failed to copy quiz link.'));
};

const [newQuestion, setNewQuestion] = useState({
  text: '',
  imageUrl: '',
  optionType: 'text', // or 'image', 'both'
});

const handleDashboard =()=>{
  navigate('/dashboard')
}

const handleTimerOptionChange = (option) => {
  setTimerOption(option);
  if (option === '5secs') {
    setTimer(5);
  } else if (option === '10secs') {
    setTimer(10);
  } else {
    setTimer(null);
  }
};




  return (
    <div style={{ width: '1280px', height: '832px', margin: '0 auto', display: 'flex', flexDirection: 'row' }}>
      {/* Dashboard Sidebar */}
      <div style={{ width: '193px', height: '832px', background: '#FFFFFF', boxShadow: '0px 4px 4px 0px #00000040',left:"0px",position:'absolute' }}>
        <span style={{ fontFamily: 'Jomhuria, sans-serif', fontSize: '70px', fontWeight: '400', lineHeight: '100px', textAlign: 'left', color: '#474444' }}>
          QUIZZIE
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', top: '309px', position: 'absolute', left: '36px' }}>
          <span onClick={handleDashboard} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '30px', textAlign: 'center', color: '#474444' }}>
            Dashboard
          </span>
          <span onClick={handleAnalysis} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '30px', textAlign: 'center', color: '#474444' }}>
            Analytics
          </span>
          <span onClick={createQuiz} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: '600', lineHeight: '30px', textAlign: 'center', color: '#474444' }}>
            Create Quiz
          </span>
        </div>
        <img src={Hz} style={{ top: '763px', left: '36px', position: 'absolute' }} alt="Hz" />
        <span onClick={logoutHandler} style={{ width: '83px', height: '30px', top: '786px', left: '55px', fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: '700', lineHeight: '30px', textAlign: 'center', position: 'absolute' }}>
          LOGOUT
        </span>
      </div>
      {/* Analysis Content */}
      <div style={{ width: '1087px', height: '832px', left: '193px', background: '#EDEDED',top:'0px',position:'absolute' }}>

        <h1 style={{ top:'60px',left:'374px',position:'absolute',fontFamily:'Poppins,sans-serif',fontSize: '50px',fontWeight: '600',lineHeight:'75px',textAlign:'center',color:'#5076FF'}}>Quiz Analysis</h1>

        <div style={{width:'929px',height:'360px',top:'187px',left:'79px',position:'absolute'}}>

          {quizzes.length === 0 ? (
            <p>Timeout, please Login</p>
            ) : (

            <div >

                <div style={{display: 'flex', flexDirection: 'row', fontWeight: 'bold',gap:'25px',
                  width:'925px',height:'35px',top:'80px',left:'250px',borderRadius:'10px',background:'#5076FF',color:'#FFFFFF',position:'sticky',
                  }}>
           
                  <p style={{ width:'60px',fontFamily:'Poppins,sans-serif',fontSize: '16px',fontWeight: '600',lineHeight:'0px',textAlign:'center',marginLeft:'10px'}}>Sl. No.</p>
                  <p style={{fontFamily:'Poppins,sans-serif',fontSize: '16px',fontWeight: '600',lineHeight:'0px',textAlign:'center',marginLeft:'10px'}}>Quiz Name</p>
                  <p style={{fontFamily:'Poppins,sans-serif',fontSize: '16px',fontWeight: '600',lineHeight:'0px',textAlign:'center',marginLeft:'10px',
                     left:'250px',position:'absolute'
                   }}>Created On</p>
                  <p style={{fontFamily:'Poppins,sans-serif',fontSize: '16px',fontWeight: '600',lineHeight:'0px',textAlign:'center',marginLeft:'10px',
                    left:'400px',position:'absolute'
                   }}>Impression</p>


              </div>
             <div  style={{width:'auto',height:'500px',top:'30px',left:'-30px',position:'absolute',overflowY:'scroll'}} >
                

              <ul>
                {quizzes.map((quiz,index) => (
                <div key={quiz._id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' ,
                  backgroundColor: index % 2 === 1 ? '#B3C4FF' : 'transparent',width: '925px',gap:'40px',
                  height:'39px',top:'90px',left:'6px',borderRadius:'10px',position:"relative"             
                }}>
                  <p style={{width:'45px', fontFamily:'Poppins,sans-serif',fontSize: '16px',fontWeight: '600',lineHeight:'0px',textAlign:'center'}}>{index + 1}.</p>

                  <h2 style={{width:'135px',fontFamily:'Poppins,sans-serif',fontSize: '16px',fontWeight: '600',lineHeight:'0px',textAlign:'center'}}>{quiz.quizName}</h2>

                  <span style={{width:'102px',fontFamily:'Poppins,sans-serif',fontSize: '16px',fontWeight: '600',lineHeight:'0px',textAlign:'center'}}>
                    {`${new Date(quiz.createdDate).getDate()} ${new Date(quiz.createdDate).toLocaleString('en-US', { month: 'short' })}, ${new Date(quiz.createdDate).getFullYear()}`}
                  </span>
              
                  <p style={{ width:'92px', fontFamily:'Poppins,sans-serif',fontSize: '16px',fontWeight: '600',lineHeight:'0px',textAlign:'center'}}>
                  {(() => {const totalImpressions = quiz.questions.reduce((sum, question) => sum + question.totalImpressions, 0);
                    return totalImpressions > 1000 ? `${(totalImpressions / 1000).toFixed(1)}k`: totalImpressions;})()}</p>

              
                  <Link to={`/question-analysis/${quiz._id}`} style={{ width:'200px',color: '#000000', textDecoration: 'underline', fontFamily:'Poppins,sans-serif',fontSize: '16px',fontWeight: '600',lineHeight:'0px',textAlign:'center',
                    left:'80px',position:'relative'
                    }}>
                    Questionwise analysis
                  </Link>

                  <div style={{width:'92px',height:'24px',left:'479px',display:'flex',flexDirection:'row',position:'absolute',justifyContent:'space-between'}}>
                    <img onClick={() => handleEditClick(quiz._id)} src={Edit}/>
                    <img onClick={() => handleDeleteClick(quiz._id)} src={Delete} />
                    <img onClick={() => handleShareClick(quiz._id)}  src={Share} />
                  </div>
                  </div>
                  ))}
              </ul>

              </div>


              
            </div>
          )}

          {isEditBlockVisible && currentQuiz && (
            <div>
              <div className="overlay" style={{width: '100vw',position: 'fixed',top: '0',left: '0',height: '100vh',backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
              </div>

              <div style={{width: '845px',height: '671px',top: '83px',left: '24px',position: 'absolute',background: '#FFFFFF',padding: '20px'}}
    >

              {/* Circle navigation */}
              <div style={{  display: 'flex', gap: '10px', flexWrap: 'wrap',top:'43px',left:'94px',position:'absolute'}}>
                {currentQuiz.questions.map((_, index) => (
                <div key={index} onClick={() => setCurrentQuestionIndex(index)} style={{width: '58px',height: '58px',borderRadius: '50%', backgroundColor: currentCircleIndex === index ? '#4CAF50' : '#E0E0E0',
                 display: 'flex',alignItems: 'center',justifyContent: 'center',color:currentCircleIndex === index ? '#FFFFFF' : '#9F9F9F',boxShadow:'0px 0px 10px 0px #00000026',
                  fontFamily:'Poppins,sans-serif',fontSize: '20px',fontWeight: '500',lineHeight:'37.5px'}}>
                  {index + 1}
                </div>
                ))}
              </div>

              {/* Display the current question */}
              <div key={currentQuiz.questions[currentQuestionIndex]._id} style={{ marginBottom: '20px' }}>
                <input type="text" value={currentQuiz.questions[currentQuestionIndex].questionText} onChange={(e) => {
                  const updatedQuestions = [...currentQuiz.questions];
                  updatedQuestions[currentQuestionIndex].questionText = e.target.value;
                  setCurrentQuiz({ ...currentQuiz, questions: updatedQuestions });
                 }}
                  style={{width:'673px',height:'50px',top:'137px',left:'94px',borderRadius:'10px',color: '#9F9F9F',
                  boxShadow:'0px 0px 25px 0px #00000026',position:'absolute', border: 'none', outline: 'none','::placeholder': {
                  color: '#9F9F9F'},fontFamily:'Poppins,sans-serif',fontSize: '25px',fontWeight: '500',lineHeight:'37.5px',textAlign:'left'}}
                />

                <div style={{display: 'flex', flexDirection: 'column', gap: '10px',top:'278px',left:'54px',position:'absolute' }}>

                  <ul>
                    {currentQuiz.questions[currentQuestionIndex]?.options?.map((option, optIndex) => (
                    <li key={option._id} style={{ marginBottom: '10px' }}>
                    <input type="text" value={option.text} onChange={(e) => {
                      const updatedQuestions = [...currentQuiz.questions];
                      updatedQuestions[currentQuestionIndex].options[optIndex].text = e.target.value;
                      setCurrentQuiz({ ...currentQuiz, questions: updatedQuestions });
                      }}
                    style={{width: '181.45px',height: '50px',borderRadius: '10px',fontFamily: 'Poppins, sans-serif',fontSize: '20px',fontWeight: '500',
                      background: currentQuiz.questions[currentQuestionIndex].correctAnswerIndex === optIndex ? '#60B84B' : '#FFFFFF',
                      color: currentQuiz.questions[currentQuestionIndex].correctAnswerIndex === optIndex ? '#FFFFFF' : '#9F9F9F',
                      lineHeight: '37.5px',textAlign: 'left'}}
                    />
                    {option.imageUrl && <img src={option.imageUrl} alt="Option" style={{ maxWidth: '100px', marginLeft: '10px' }} />}
                    </li>
                    ))}
                  </ul>
                </div>
          
                {/* Timer control for Qna type questions */}
                {currentQuiz.questions[currentQuestionIndex].questionType === 'Qna' && (
                  <div style={{width:'95px',height:'183px',top:'426px',left:'671px',display:'flex',flexDirection:'column',position:'absolute',gap:'10px'}}>
                   <h2 style={{fontFamily:'Poppins,sans-serif',fontSize: '20px',fontWeight: '500',lineHeight:'0px',textAlign:'center',color:'#9F9F9F'}}>Timer</h2>
                  <button onClick={() => {const updatedQuestions = [...currentQuiz.questions];
                    updatedQuestions[currentQuestionIndex].timer = 5;
                    setCurrentQuiz({ ...currentQuiz, questions: updatedQuestions });
                    }}
                    style={{
                      backgroundColor: currentQuiz.questions[currentQuestionIndex].timer === 5 ? '#D60000' : '#FFFFFF',
                      color: '#9F9F9F',
                      width:'95px',height:'34px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000026',
                      border: 'none', outline: 'none'}}>5 sec
                  </button>

                  <button onClick={() => {const updatedQuestions = [...currentQuiz.questions];
                    updatedQuestions[currentQuestionIndex].timer = 10;
                    setCurrentQuiz({ ...currentQuiz, questions: updatedQuestions });
                  }}
                  style={{
                    backgroundColor: currentQuiz.questions[currentQuestionIndex].timer === 10 ? '#D60000' : '#FFFFFF',
                    color: '#9F9F9F',
                    width:'95px',height:'34px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000026',
                    border: 'none', outline: 'none'}}>10 sec
                  </button>
                  <button onClick={() => {
                    const updatedQuestions = [...currentQuiz.questions];
                    updatedQuestions[currentQuestionIndex].timer = 0; // 0 means no timer
                    setCurrentQuiz({ ...currentQuiz, questions: updatedQuestions });
                  }}
                  style={{
                    backgroundColor: currentQuiz.questions[currentQuestionIndex].timer === 0 ? '#D60000' : '#FFFFFF',
                    color: '#9F9F9F',width:'95px',height:'34px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000026',
                    border: 'none', outline: 'none'
                  }}>OFF
                  </button>
                </div>
                )}
              </div>

              <div style={{ width: '674px',height: '46.14px',top:`620px`,left:'13%',position:'absolute',gap:'90px',display:'flex',flexDirection:'row'}}>
                <button style={{width: '279px',height:'46.14px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000040',color:'#474444', border: 'none', 
                  outline: 'none',fontFamily: 'Poppins, sans-serif', fontSize: '25px', fontWeight: '500', lineHeight: '37.5px', textAlign: 'center'}}
                  onClick={handleCloseEditBlock}>Cancel
                </button>

                <button style={{ width: '279px',height:'46.14px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000040',background:'#60B84B',
                  color:'#FFFFFF', border: 'none', outline: 'none',fontFamily: 'Poppins, sans-serif', fontSize: '25px', fontWeight: '500',
                  lineHeight: '37.5px', textAlign: 'center'}}
                  onClick={() => handleUpdateQuiz(currentQuiz._id)}
                >Save Changes</button>
                
              </div>
            </div>
        </div>
        )}








      {isDeleteDialogVisible && (
        <div>
          <div className="overlay" style={{ width: '100vw', position: 'fixed', top: '0', left: '0', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
          <div style={{width:'845px',height:'299px',top:'80px',left:'10px',borderRadius:'10px',padding: '20px', background: '#FFF',position:'absolute' }}>
            <h3 style={{width:'502px',left:'20%',fontFamily:'Poppins,sans-serif',fontSize: '39px',fontWeight: '600',lineHeight:'58.5px',textAlign:'center',
              color:'#474444',position:'absolute'  }}>Are you confirm you want to delete ?</h3>
            <div style={{ display: 'flex', marginTop: '20px',width:'900px',left:'125px',top:'216px',position:'absolute',gap:'100px' }}>
            
              <button onClick={handleConfirmDelete} style={{ width: '279px', height: '43px', borderRadius: '10px', backgroundColor: '#FF4B4B', color: '#FFF', border: 'none', outline: 'none',
                fontFamily:'Poppins,sans-serif',fontSize: '18px',fontWeight: '600',lineHeight:'27px',textAlign:'center',
               }}>
                Delete
              </button>
              <button onClick={handleCancelDelete} style={{ width: '279px', height: '43px', borderRadius: '10px', backgroundColor: '#FFFFFF', color: '#000', border: 'none', outline: 'none', 
              fontFamily:'Poppins,sans-serif',fontSize: '18px',fontWeight: '600',lineHeight:'27px',textAlign:'center',
                boxShadow: '0px 0px 15px 0px #00000040'
               }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
       
      </div>

      {/* Create Quiz Popup */}
      {isCreateQuizkVisible && (
                 <div>
                    <div className="overlay" style={{ width: '100vw', position: 'fixed', top: '0', left: '0', height: '200vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
                <div ref={popupRef} style={{width:'845px',height:'422px',top:'266px',left:'25%',borderRadius:'10px',background:'#FFFFFF',display:'flex',flexDirection:'column',position:'absolute'}}>
                    <input style={{width:'673px',height:'81px',top:'98px',left:'86px',borderRadius:'10px',boxShadow:'0px 0px 25px 0px #00000026',position:'absolute',
                         border: 'none', outline: 'none',color: '#9F9F9F','::placeholder': {
                    color: '#9F9F9F',                   
                    opacity: 1, // Ensures that the color is applied as intended
                },fontFamily:'Poppins,sans-serif',fontSize: '25px',fontWeight: '500',lineHeight:'37.5px',textAlign:'left'
                    }}
                    id="quizName" type="text"
                    placeholder="Quiz name "
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                    />
                     {error.quizName && <span style={{ color: 'red' }}>Quiz Name is required.</span>}

                    <div style={{ top:'200px',left:'98px',display:'flex',gap:'67.5px',flexDirection:'row',position:'absolute',
                        width: '648px',height:'47px',justifyContent:'space-between'}}>
                        <span style={{fontFamily:'Poppins,sans-serif',fontSize: '25px',fontWeight: '500',lineHeight:'37.5px',textAlign:'left',color:'#9F9F9F'}}>Quiz Type</span>
                        <button style={{width:'171px',height:'46px',borderRadius:'10px',
                            boxShadow: '0px 0px 25px 0px #00000026',border: 'none', outline: 'none',
                            fontFamily:'Poppins,sans-serif',fontSize: '25px',fontWeight: '500',lineHeight:'37.5px',textAlign:'center',
                            background: clickedButton === 'qna' ? '#60B84B' : '#FFFFFF',
                            color: clickedButton === 'qna' ? '#FFFFFF' : '#9F9F9F',
                            cursor: 'pointer',
                        }}
                        onClick={() =>  { setClickedButton('qna'); handleInputsBlock(); }}
                        >Q & A</button>
                        <button
                        style={{width:'171px',height:'46px',borderRadius:'10px',
                            boxShadow: '0px 0px 25px 0px #00000026',border: 'none', outline: 'none',
                            fontFamily:'Poppins,sans-serif',fontSize: '25px',fontWeight: '500',lineHeight:'37.5px',textAlign:'center',
                            background: clickedButton === 'poll' ? '#60B84B' : '#FFFFFF',
                            color: clickedButton === 'poll' ? '#FFFFFF' : '#9F9F9F',
                            cursor: 'pointer',
                        }}
                        onClick={() =>{ setClickedButton('poll'); handleInputsBlock(); }}
                            >Poll Type</button>
                    </div>
                    <div style={{display:'flex', width: '648px',gap:'67.5px',flexDirection:'row',top:'305px',left:'97px',position:'absolute',ustifyContent:'space-between'}}>
                        <button onClick={closeCreateQuiz} style={{width:'279px',height:'46.14px',top:'571px',left:'315px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000040',background:'#FFFFFF',color:'#474444',
                             fontFamily:'Poppins,sans-serif',fontSize: '25px',fontWeight: '500',lineHeight:'37.5px',textAlign:'center',border: 'none', outline: 'none',
                        }}>Cancel</button>
                        <button onClick={handleInputsBlock}style={{width:'279px',height:'46.14px',top:'571px',left:'315px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000040',background:'#60B84B',color:'#FFFFFF',
                             fontFamily:'Poppins,sans-serif',fontSize: '25px',fontWeight: '500',lineHeight:'37.5px',textAlign:'center',border: 'none', outline: 'none'}}>Continue</button>
                    </div>

                </div>
                 </div>
            )}

      

      {/* QA Block */}
      
      {isQABlockVisible && (
              <div>
                  <div className="overlay" style={{ width: '100vw', position: 'fixed', top: '0', left: '0', height: '200vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
                  <div style={{width:'845px',height:'671px',top:'83px',left:'217px',position:'absolute',background:'#FFFFFF'}}>
                      <div>
                          <div className="circle"  style={{ display: 'flex', gap: '10px', flexWrap: 'wrap',top:'43px',left:'94px',position:'absolute'}}>
                            {circles.map((circle, index) => (
                                <div key={index} className="circle" style={{width: '58px',height: '58px',borderRadius: '50%', backgroundColor: currentCircleIndex === index ? '#4CAF50' : '#E0E0E0',
                                    display: 'flex',alignItems: 'center',justifyContent: 'center',color:currentCircleIndex === index ? '#FFFFFF' : '#9F9F9F',boxShadow:'0px 0px 10px 0px #00000026',
                                    fontFamily:'Poppins,sans-serif',fontSize: '20px',fontWeight: '500',lineHeight:'37.5px'}} onClick={() => handleCircleClick(index)}>
                                    {circle.number}
                                </div>
                            ))}
                            {circles.length < 5 && (<div className="circle" onClick={addCircle} style={{width: '58px',height: '58px',borderRadius: '50%',background: '#FFFFFF',display: 'flex',
                              alignItems: 'center',justifyContent: 'center',fontSize: '24px',color: '#000',cursor: 'pointer'}}>
                                  <span onClick={ handleSaveQuestion}>+</span>
                            </div>)}
                          </div>
                          <span style={{fontFamily:'Poppins,sans-serif',fontSize: '20px',fontWeight: '500',lineHeight:'37.5px',textAlign:'center',color:'#9F9F9F',
                              top:'57px',left:'604px',position:'absolute'}}>Max 5 questions
                          </span>
                      </div>

                      <input style={{width:'673px',height:'50px',top:'137px',left:'94px',borderRadius:'10px',color: '#9F9F9F',
                              boxShadow:'0px 0px 25px 0px #00000026',position:'absolute', border: 'none', outline: 'none','::placeholder': {
                          color: '#9F9F9F'},fontFamily:'Poppins,sans-serif',fontSize: '25px',fontWeight: '500',lineHeight:'37.5px',textAlign:'left'                }}
                          id="qAQuestion"
                          type="text"
                          placeholder="Q&A Question "
                          value={qAQuestion}
                          onChange={(e) => setQAQuestion(e.target.value)}
                      />
                       {error.qAQuestion && <p style={{ color: 'red' }}>Question is required</p>}

                      <div style={{display:'flex',flexDirection:'row',gap:'10px',width:'674px',left:'100px',top:'215px',position:'absolute',
                          justifyContent:'space-evenly'}}>
                            <span style={{fontFamily:'Poppins,sans-serif',fontSize: '20px',fontWeight: '500',lineHeight:'30px',textAlign:'left',color:'#9F9F9F'}}>Option Type </span>
                             {options.map((option, index) => (
                              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                {option.hasDot && (
                                  <div onClick={() => handleDotClick(index)} style={{width: '12px',height: '12px',borderRadius: '50%',
                                      background: selectedDot === index ? '#000' : '#FFFFFF',marginRight: '10px',cursor: 'pointer',border: '2px solid #9F9F9F',}}
                                  />
                                )}
                                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '25px', fontWeight: '500', color: '#9F9F9F', lineHeight: '37.5px', textAlign: 'left' }}>
                                {option.label}
                                </span>
                              </div>
                            ))}
                        </div>

                        <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px',top:'278px',left:'54px',position:'absolute' }}>
                              {inputs.map((input, index) => (
                              <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}
                              onClick={() => handleSelectCorrectAnswer(index)} >
                                <div style={{width: '12px',height: '12px',borderRadius: '50%',border: '2px solid #9F9F9F',backgroundColor: correctAnswerIndex === index ? '#60B84B' : '#FFFFFF'}}>
                                </div>
                                {selectedDot === 0 && (
                                <input 
                                type="text"
                                placeholder="Enter text"
                                style={{
                                  width: '296px',
                                  height: '50px',
                                  borderRadius: '10px',
                                  fontFamily: 'Poppins, sans-serif',
                                  fontSize: '20px',
                                  fontWeight: '500',
                                  background: correctAnswerIndex === index ? '#60B84B' :'#FFFFFF',
                                  color: correctAnswerIndex=== index?'#FFFFFF':'#9F9F9F',
                                  lineHeight: '37.5px',
                                  textAlign: 'left'
                                }}
                                value={input.text}
                                onChange={(event) => handleInputChange(index, event, 'text')}
                              />
                              )}
                            {selectedDot === 1 && (
                              <input
                                type="url"
                                placeholder="Enter image URL"
                                style={{
                                  width: '296px',
                                  height: '50px',
                                  borderRadius: '10px',
                                  fontFamily: 'Poppins, sans-serif',
                                  fontSize: '20px',
                                  fontWeight: '500',
                                  background: correctAnswerIndex === index ? '#60B84B' :'#FFFFFF',
                                  color: correctAnswerIndex=== index?'#FFFFFF':'#9F9F9F',
                                  lineHeight: '37.5px',
                                  textAlign: 'left'
                                }}
                                value={input.imageUrl}
                                onChange={(event) => handleInputChange(index, event, 'imageUrl')}
                              />
                            )}
                          {selectedDot === 2 && (
                            <>
                              <input
                                type="text"
                                placeholder="Enter text"
                                style={{
                                  width: '181.45px',
                                  height: '50px',
                                  borderRadius: '10px',
                                  fontFamily: 'Poppins, sans-serif',
                                  fontSize: '20px',
                                  fontWeight: '500',
                                  background: correctAnswerIndex === index ? '#60B84B' : '#FFFFFF',
                                  color: correctAnswerIndex=== index?'#FFFFFF':'#9F9F9F',
                                  lineHeight: '37.5px',
                                  textAlign: 'left'
                                }}
                                value={input.text}
                                onChange={(event) => handleInputChange(index, event, 'text')}
                              />
                              <input
                                type="url"
                                placeholder="Enter image URL"
                                style={{
                                  width: '296px',
                                  height: '50px',
                                  borderRadius: '10px',
                                  fontFamily: 'Poppins, sans-serif',
                                  fontSize: '20px',
                                  fontWeight: '500',
                                  background: correctAnswerIndex === index ? '#60B84B' : '#FFFFFF',
                                  color: correctAnswerIndex=== index?'#FFFFFF':'#9F9F9F',
                                  lineHeight: '37.5px',
                                  textAlign: 'left'
                                }}
                                value={input.imageUrl}
                                onChange={(event) => handleInputChange(index, event, 'imageUrl')}
                              />
                            </>
                          )}
                          <img src={Delete} alt="Delete" style={{ width: '24px', height: '24px', marginLeft: '15px', cursor: 'pointer' }}
                            onClick={() => handleDeleteOption(index)}
                          />
                        </div>
                      ))}
                      <button
                                  style={{
                                    width: '296px',
                                    height: '50px',
                                    borderRadius: '10px',
                                    boxShadow: '0px 0px 25px 0px #00000026',
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '25px',
                                    fontWeight: '500',
                                    color: '#9F9F9F',
                                    lineHeight: '37.5px',
                                    textAlign: 'left',
                                    marginTop: '20px',
                                    marginLeft:'25px'
                                  }}
                                  onClick={handleAddOption}
                                >
                                  Add option
                                </button>

                                <div style={{width: '674px',height: '46.14px',top:`${topPosition}px`,left:'35px',position:'absolute',gap:'90px',display:'flex',flexDirection:'row'}}>
                                <button style={{width: '279px',height:'46.14px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000040',
                                  color:'#474444', border: 'none', outline: 'none',fontFamily: 'Poppins, sans-serif', fontSize: '25px', fontWeight: '500', lineHeight: '37.5px', textAlign: 'center'
                                }} onClick={closeQAblock}>Cancel</button>
                                <button style={{width: '279px',height:'46.14px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000040',background:'#60B84B',
                                  color:'#FFFFFF', border: 'none', outline: 'none',fontFamily: 'Poppins, sans-serif', fontSize: '25px', fontWeight: '500',
                                   lineHeight: '37.5px', textAlign: 'center'}} onClick={handleQuizName}>Create Quiz</button>
                              </div>

                              <div style={{ width: '95px', height: '183px', top: '143px', left: '600px', display: 'flex', flexDirection: 'column', position: 'absolute', gap: '10px' }}>
                                    <button
                                      onClick={() => handleTimerOptionChange('off')}
                                      style={{
                                        width: '95px',
                                        height: '34px',
                                        borderRadius: '10px',
                                        boxShadow: '0px 0px 15px 0px #00000026',
                                        border: 'none',
                                        outline: 'none',
                                        background: timerOption === 'off' ? '#D60000' : '#FFFFFF',
                                        color: timerOption === 'off' ? '#FFFFFF' : '#9F9F9F'
                                      }}
                                    >
                                      Off
                                    </button>
                                    <button
                                      onClick={() => handleTimerOptionChange('5secs')}
                                      style={{
                                        width: '95px',
                                        height: '34px',
                                        borderRadius: '10px',
                                        boxShadow: '0px 0px 15px 0px #00000026',
                                        border: 'none',
                                        outline: 'none',
                                        background: timerOption === '5secs' ? '#D60000' : '#FFFFFF',
                                        color: timerOption === '5secs' ? '#FFFFFF' : '#9F9F9F'
                                      }}
                                    >
                                      5 secs
                                    </button>
                                    <button
                                      onClick={() => handleTimerOptionChange('10secs')}
                                      style={{
                                        width: '95px',
                                        height: '34px',
                                        borderRadius: '10px',
                                        boxShadow: '0px 0px 15px 0px #00000026',
                                        border: 'none',
                                        outline: 'none',
                                        background: timerOption === '10secs' ? '#D60000' : '#FFFFFF',
                                        color: timerOption === '10secs' ? '#FFFFFF' : '#9F9F9F'
                                      }}
                                    >
                                      10 secs
                                    </button>
                                  </div>

                              </div>
                            </div>
                           
                          </div>

                        </div>
                      )}

      {/* Poll Block */}

      {isPollBlockVisible && (

<div>
     <div className="overlay" style={{ width: '100vw', position: 'fixed', top: '0', left: '0', height: '200vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
        <div style={{width:'845px',height:'671px',top:'83px',left:'217px',position:'absolute',background:'#FFFFFF'}}>
          <div>
            <div className="circle"  style={{ display: 'flex', gap: '10px', flexWrap: 'wrap',top:'43px',left:'94px',position:'absolute'}}>
              {circles.map((circle, index) => (
                <div key={index} className="circle" style={{width: '58px',height: '58px',borderRadius: '50%', backgroundColor: currentCircleIndex === index ? '#4CAF50' : '#E0E0E0',
                  display: 'flex',alignItems: 'center',justifyContent: 'center',color:currentCircleIndex === index ? '#FFFFFF' : '#9F9F9F',boxShadow:'0px 0px 10px 0px #00000026',
                  fontFamily:'Poppins,sans-serif',fontSize: '20px',fontWeight: '500',lineHeight:'37.5px'}} onClick={() => handleCircleClick(index)}>
                  {circle.number}
                </div>
              ))}
              {circles.length < 5 && (<div className="circle" onClick={addCircle} style={{width: '58px',height: '58px',borderRadius: '50%',background: '#FFFFFF',display: 'flex',
                alignItems: 'center',justifyContent: 'center',fontSize: '24px',color: '#000',cursor: 'pointer'}}>
              <span onClick={ handleSaveQuestion}>+</span>
            </div>)}
          </div>
          <span style={{fontFamily:'Poppins,sans-serif',fontSize: '20px',fontWeight: '500',lineHeight:'37.5px',textAlign:'center',color:'#9F9F9F',
            top:'57px',left:'604px',position:'absolute'}}>Max 5 questions
          </span>
        </div>

<input style={{width:'673px',height:'50px',top:'137px',left:'94px',borderRadius:'10px',color: '#9F9F9F',
      boxShadow:'0px 0px 25px 0px #00000026',position:'absolute', border: 'none', outline: 'none','::placeholder': {
  color: '#9F9F9F'},fontFamily:'Poppins,sans-serif',fontSize: '25px',fontWeight: '500',lineHeight:'37.5px',textAlign:'left'                }}
  id="pollQuestion"
  type="text"
  placeholder="Poll Question  "
  value={pollQuestion}
  onChange={(e) => setPollQuestion(e.target.value)}
/>
{error.pollQuestion && <p style={{ color: 'red' }}>Question is required</p>}

<div style={{display:'flex',flexDirection:'row',gap:'10px',width:'674px',left:'100px',top:'215px',position:'absolute',
  justifyContent:'space-evenly'}}>
    <span style={{fontFamily:'Poppins,sans-serif',fontSize: '20px',fontWeight: '500',lineHeight:'30px',textAlign:'left',color:'#9F9F9F'}}>Option Type </span>
     {options.map((option, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        {option.hasDot && (
          <div onClick={() => handleDotClick(index)} style={{width: '12px',height: '12px',borderRadius: '50%',
              background: selectedDot === index ? '#000' : '#FFFFFF',marginRight: '10px',cursor: 'pointer',border: '2px solid #9F9F9F',}}
          />
        )}
        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '25px', fontWeight: '500', color: '#9F9F9F', lineHeight: '37.5px', textAlign: 'left' }}>
        {option.label}
        </span>
      </div>
    ))}
</div>

<div>
<div style={{ display: 'flex', flexDirection: 'column', gap: '10px',top:'278px',left:'54px',position:'absolute' }}>
      {inputs.slice(0, 4).map((input, index) => (
      <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}
      onClick={() => handleSelectCorrectAnswer(index)} >
        <div style={{width: '12px',height: '12px',borderRadius: '50%',border: '2px solid #9F9F9F',backgroundColor: correctAnswerIndex === index ? '#60B84B' : '#FFFFFF'}}>
        </div>
        {selectedDot === 0 && (
        <input 
        type="text"
        placeholder="Enter text"
        style={{
          width: '296px',
          height: '50px',
          borderRadius: '10px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '20px',
          fontWeight: '500',
          background: correctAnswerIndex === index ? '#60B84B' :'#FFFFFF',
          color: correctAnswerIndex=== index?'#FFFFFF':'#9F9F9F',
          lineHeight: '37.5px',
          textAlign: 'left'
        }}
        value={input.text}
        onChange={(event) => handleInputChange(index, event, 'text')}
        
      />
      )}
    {selectedDot === 1 && (
      <input
        type="url"
        placeholder="Enter image URL"
        style={{
          width: '296px',
          height: '50px',
          borderRadius: '10px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '20px',
          fontWeight: '500',
          background: correctAnswerIndex === index ? '#60B84B' :'#FFFFFF',
          color: correctAnswerIndex=== index?'#FFFFFF':'#9F9F9F',
          lineHeight: '37.5px',
          textAlign: 'left'
        }}
        value={input.imageUrl}
        onChange={(event) => handleInputChange(index, event, 'imageUrl')}
      
      />
    )}
  {selectedDot === 2 && (
    <>
      <input
        type="text"
        placeholder="Enter text"
        style={{
          width: '181.45px',
          height: '50px',
          borderRadius: '10px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '20px',
          fontWeight: '500',
          background: correctAnswerIndex === index ? '#60B84B' : '#FFFFFF',
          color: correctAnswerIndex=== index?'#FFFFFF':'#9F9F9F',
          lineHeight: '37.5px',
          textAlign: 'left'
        }}
        value={input.text}
        onChange={(event) => handleInputChange(index, event, 'text')}
        disabled={index < 2}
      />
      <input
        type="url"
        placeholder="Enter image URL"
        style={{
          width: '296px',
          height: '50px',
          borderRadius: '10px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '20px',
          fontWeight: '500',
          background: correctAnswerIndex === index ? '#60B84B' : '#FFFFFF',
          color: correctAnswerIndex=== index?'#FFFFFF':'#9F9F9F',
          lineHeight: '37.5px',
          textAlign: 'left'
        }}
        value={input.imageUrl}
        onChange={(event) => handleInputChange(index, event, 'imageUrl')}
        disabled={index < 2}
      />
    </>
  )}
   {index >= 2 && (
    <img
      src={Delete}
      alt="Delete"
      style={{ width: '24px', height: '24px', marginLeft: '10px', cursor: 'pointer' }}
      onClick={() => handleDeleteOption (index)}
    />
    )}
</div>
))}

        <div style={{width: '674px',height: '46.14px',top:`${topPosition}px`,left:'35px',position:'absolute',gap:'90px',display:'flex',flexDirection:'row'}}>
        <button style={{width: '279px',height:'46.14px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000040',
          color:'#474444', border: 'none', outline: 'none',fontFamily: 'Poppins, sans-serif', fontSize: '25px', fontWeight: '500', lineHeight: '37.5px', textAlign: 'center'
        }} onClick={closePollBlock}>Cancel</button>
        <button style={{width: '279px',height:'46.14px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000040',background:'#60B84B',
          color:'#FFFFFF', border: 'none', outline: 'none',fontFamily: 'Poppins, sans-serif', fontSize: '25px', fontWeight: '500',
           lineHeight: '37.5px', textAlign: 'center'}} onClick={handleQuizName}>Create Quiz</button>
      </div>
      </div>
    </div>
   
  </div>

</div>

)}


{isPublishedVisible && (
              <div>
                 <div className="overlay" style={{ width: '100vw', position: 'fixed', top: '0', left: '0', height: '200vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>

                 <div style={{width:'845px',height:'481px',top:'176px',left:'218px',borderRadius:'10px',background:'#FFFFFF',display:'flex',flexDirection:'column',position:'absolute'}}>

                  <span style={{width:'30px',height:'19.91px',top:'5px',left:'815px',border:'3.5px',color:'#474444',position:'absolute',
                    fontFamily:'Poppins,sans-serif',fontSize: '20px',fontWeight: '300',lineHeight:'37.5px',
                  }}onClick={closePublishBlock}>X</span>

                  <span style={{width:'502px',top:'101px',left:'197px',position:'absolute',fontFamily:'Poppins,sans-serif',fontSize: '39px',fontWeight: '600',lineHeight:'58.5px',textAlign:'center',color:'#474444'}}>Congrats your Quiz is Published!</span>

                  <div style={{width:'675px',height:'60px',top:'256px',left:'110px',position:'absolute',borderRadius:'10px',background:'#EDEDED',display:'flex',alignItems:'left'}}>
                    <span style={{fontFamily:'Poppins,sans-serif',fontSize: '25px',fontWeight: '600',lineHeight:'37.5px',textAlign:'left',color:'#474444',marginLeft:'40px',marginTop:'10px'}}>your link is here</span>
                  </div>
                  <button style={{width:'279px',height:'46.14px',top:'360px',left:'308px',borderRadius:'10px',background:'#60B84B',color:'#FFFFFF',position:'absolute',
                      fontFamily:'Poppins,sans-serif',fontSize: '21px',fontWeight: '600',lineHeight:'31.5px',textAlign:'center',border: 'none', outline: 'none'
                    }} onClick={handleCopyLink}>Share</button>
                 </div>
              </div>
            )}


      
    </div>
  );
};

export default Analysis;
