import React, { useEffect, useState ,useRef} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Use useParams for route params
import Hz from '../assets/Hz.png'
import Delete from '../assets/delete.png'
import { useNavigate } from "react-router-dom";
import HzLine from '../assets/HzLine.png';

const QuestionAnalysisPage = () => {
  const { id: quizId } = useParams(); // Extract quizId from route params
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateQuizkVisible, setIsCreateQuizkVisible] = useState(false);
  const [qAQuestion,setQAQuestion]=useState('');
  const [pollQuestion,setPollQuestion] = useState('');
  const [isQABlockVisible,setIsQABlockVisible]= useState(false);
  const [isPollBlockVisible,setIsPollBlockVisible]= useState(false);
  
  const [clickedButton, setClickedButton] = useState(null);
  const [circles, setCircles] = useState([{ number: 1 }]);
  const [currentCircleIndex, setCurrentCircleIndex] = useState(0);
  const [inputs, setInputs] = useState([]);
  const [options, setOptions] = useState([
    { label: 'Text', hasDot: true },
    { label: 'Image',  hasDot: true },
    { label: 'Text-Image', hasDot: true }
]);
const [quizName, setQuizName] = useState('');
  const [selectedDot, setSelectedDot] = useState(0);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
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
  const [currentQuestionInput,setCurrentQuestionInput]=useState({
    question: '',
    options: [],
    correctAnswerIndex: null,
});
  const popupRef = useRef(null);
  const handleDashboard =()=>{
    navigate('/dashboard')
  }
  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const backendUrl = process.env.REACT_APP_QUIZBOT_BACKEND_URL;
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in localStorage');
        }

        const response = await axios.get(`${backendUrl}/quiz/quiz/${quizId}`, { // Ensure endpoint matches your API
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setQuiz(response.data);
        console.log('setQuiz:',response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const logoutHandler = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
   navigate('/');
};

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
   // handlePollBlockVisibility();
    setIsPollBlockVisible(true);
    setIsQABlockVisible(false);
    console.log('type:', clickedButton);
  }
}

console.log('Current clickedButton:', clickedButton);


const closePollBlock =()=>{
  setIsPollBlockVisible(false);
}

const handleDeleteOption = (indexToDelete) => {
  // Delete the input at the specified index
  setInputs(prevInputs => prevInputs.filter((_, index) => index !== indexToDelete));

  if (correctAnswerIndex === indexToDelete) {
    setCorrectAnswerIndex(null);
  } else if (correctAnswerIndex > indexToDelete) {
    setCorrectAnswerIndex(correctAnswerIndex - 1);
  }
};


const handleSelectCorrectAnswer = (index) => {
setCorrectAnswerIndex(index); // Set the selected option as the correct answer
};


const handleInputChange = (index, event, type) => {
  const updatedInputs = [...inputs];
  if (type === 'text') {
    updatedInputs[index].text = event.target.value;
  } else if (type === 'imageUrl') {
    updatedInputs[index].imageUrl = event.target.value;
  }
  setInputs(updatedInputs);

  setCurrentQuestionInput({
    ...currentQuestionInput,
    [event.target.name]: event.target.value,
});
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

  if (qAQuestion) {
    updatedCircles[currentCircleIndex] = {
        number: currentCircleIndex + 1,
        questionData: {
            type: 'Qna',  // This sets the question type as 'QA'
            question: qAQuestion,
            options: inputs,
            correctAnswerIndex: correctAnswerIndex,
            timer: timerValue
        }
    };
} else if (pollQuestion) {
  const pollOptions = inputs.map((input, index) => ({
    text: `Option ${index + 1}`,
    value: input.text || ''
}));
  
  updatedCircles[currentCircleIndex] = {
    number: currentCircleIndex + 1,
    questionData: {
        type: 'Poll',  // This sets the question type as 'Poll'
        question: pollQuestion,
        options: pollOptions,
        timer: 0
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


const validatePollQuestion = (pollQuestion) => {
  if (!pollQuestion || pollQuestion.trim() === '') {
      return true; // Error exists if pollQuestion is empty or just whitespace
  }
  // Add more validation logic here if needed
  return false; // No error
};

// Validation for QAQuestion
const validateQAQuestion = (qAQuestion) => {
  if (!qAQuestion || qAQuestion.trim() === '') {
      return true; // Error exists if qaQuestion is empty or just whitespace
  }
  // Add more validation logic here if needed
  return false; // No error
};

const handleQuizName = async () => {


  
  const updatedCircles = [...circles];
  if ((pollQuestion.trim() !== '' || qAQuestion.trim() !== '') || inputs.length > 0) {

    
  let timerValue = timerOption === 'off' ? 0 : timer; 
  console.log('Timer value:', timerValue); // Add this line to debug timer value
    updatedCircles[currentCircleIndex] = {
        number: circles[currentCircleIndex]?.number || currentCircleIndex + 1,
        questionData: {
            question: clickedButton === 'poll' ? pollQuestion : qAQuestion,
            options: inputs,
            correctAnswerIndex,
            timer: clickedButton === 'qna' ? timerValue : undefined 
        }
    };
}
  // Set circles state
  setCircles(updatedCircles);


  let newError = { quizName: !quizName };

  if (clickedButton === 'poll') {
    newError = { ...newError, pollQuestion: validatePollQuestion(pollQuestion) };
} else if (clickedButton === 'qna') {
    newError = { ...newError, qAQuestion: validateQAQuestion(qAQuestion) };
}
  setError(newError);

  if (Object.values(newError).includes(true)) {
      console.log("Error exists in the form");
      return;
  }

  const validQuestions = updatedCircles.filter(circle => {
    const { questionData } = circle;
    return questionData.question.trim() !== '' && questionData.options.length > 0;
}).map(circle => 
  { return {
        questionText: circle.questionData.question,
        options: circle.questionData.options,
        correctAnswerIndex: circle.questionData.correctAnswerIndex,
        questionType: clickedButton.charAt(0).toUpperCase() + clickedButton.slice(1),
        timer: circle.questionData.timer  
    };
});

  const quizData = {
      quizName,
      questions: validQuestions
  }

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
  const updatedCircles = [...circles];

  if ((pollQuestion.trim() !== '' || qAQuestion.trim() !== '') || inputs.length > 0) {
    let timerValue = timerOption === 'off' ? 0 : timer; 
      // Determine the question type and save accordingly
      if (qAQuestion.trim() !== '') {
          updatedCircles[currentCircleIndex] = {
              number: circles[currentCircleIndex].number || currentCircleIndex + 1,
              questionData: {
                  type: 'Qna',  // This sets the question type as 'QA
                  question: qAQuestion,
                  options: inputs,
                  correctAnswerIndex: correctAnswerIndex || null,
                  timer: timerValue 
              }
          };
      } else if (pollQuestion.trim() !== '') {
          const pollOptions =  [
              { text: 'Option 1', value: inputs[0]?.text || '' },
              { text: 'Option 2', value: inputs[1]?.text || '' },
              { text: 'Option 3', value: inputs[2]?.text || '' },
              { text: 'Option 4', value: inputs[3]?.text || '' },
          ];

          updatedCircles[currentCircleIndex] = {
              number: circles[currentCircleIndex].number || currentCircleIndex + 1,
              questionData: {
                  type: 'Poll',  // This sets the question type as 'Poll'
                  question: pollQuestion,
                  options: inputs,
              }
          };
      }
  }

    const newCircle = { number: circles.length + 1, questionData: { question: '', options: [] } };
    setCircles([...circles, newCircle]);
    setCurrentCircleIndex(circles.length);
    setQAQuestion('');  // Clear input boxes
    setInputs([]);       // Clear options
    setCorrectAnswerIndex(null); // Clear correct answer selection  
    };

const handleCircleClick = (index) => {
  const circle = circles[index];
  setCurrentCircleIndex(index);
  if (circle) {
    setQAQuestion(circle.questionData.question);
    setPollQuestion(circle.questionData.question);
    setInputs(circle.questionData.options || []);
    setCorrectAnswerIndex(circle.questionData.correctAnswerIndex || null);
  }
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!quiz) return <p>No quiz data found.</p>;

  return (
    <div className="question-analysis">

       {/* Dashboard Sidebar */}
       <div style={{ width: '193px', height: '832px', background: '#FFFFFF', boxShadow: '0px 4px 4px 0px #00000040',left:"0px",position:'absolute' }}>
        <span style={{ fontFamily: 'Jomhuria, sans-serif', fontSize: '70px', fontWeight: '400', lineHeight: '100px', textAlign: 'left', color: '#474444',
          left:'36px',position:'absolute'
         }}>
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

      {/* Score page */}
      <div style={{width:'1087px',height:'832px',left:'193px',background:'#EDEDED',position:'absolute',top:'0px'}}>

      <div style={{display:'flex',flexDirection:'row',left:'79px',top:'57px',position:'absolute',gap:'100px'}}>

          <h1 style={{fontFamily: 'Poppins, sans-serif', fontSize: '40px', fontWeight: '600', lineHeight: '60px', textAlign: 'center', color: '#5076FF' }}>{quiz.quizName} Question Analysis</h1>
          <div style={{display:'flex',flexDirection:'column',fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: '600',
            color:'#FF5D01',gap:'0px',alignItems:'start'
          }}>
            <span>Created on:{`${new Date(quiz.createdDate).getDate()} ${new Date(quiz.createdDate).toLocaleString('en-US', { month: 'short' })}, ${new Date(quiz.createdDate).getFullYear()}`} </span>
            <span>Total Impressions: {quiz.questions.reduce((acc, q) => acc + q.totalImpressions, 0)}</span>
          </div>
      </div>

      <div className="questions" style={{overflowY:'scroll',maxHeight: '651px',margin: '0 auto',width:'1500px',top:'181px',position:'absolute',overflowX:'hidden'}}>
        {quiz.questions.map((question, qIndex) => (
          <div key={question._id} className="question-section" style={{width:'828px',height:'159px',top:'100px',left:'88px',position:'relative',display:'flex',flexDirection:'column',
            marginTop:'80px'
           }}>
            <h2 style={{fontFamily: 'Poppins, sans-serif', fontSize: '30px', fontWeight: '500', lineHeight: '45px', textAlign: 'left',}}>Question {qIndex + 1}: {question.questionText}</h2>

            {question.questionType === "Qna" ? (
              <div>
                <div style={{display:'flex',flexDirection:'row',gap:'20px'}}>
                <div  style={{display:'flex',flexDirection:'column',width:'245px',height:'89px',borderRadius:'5px',background:'#FFFFFF',color:'#474444'}}>
                  <span style={{fontFamily: 'Poppins, sans-serif', fontSize: '30px', fontWeight: '600', lineHeight: '45px', textAlign: 'center',}}>{question.totalImpressions}</span>
                  <span style={{fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: '600', lineHeight: '21px', textAlign: 'center',}}>People attempted the question</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',width:'245px',height:'89px',borderRadius:'5px',background:'#FFFFFF',color:'#474444'}}>
                  <span  style={{fontFamily: 'Poppins, sans-serif', fontSize: '30px', fontWeight: '600', lineHeight: '45px', textAlign: 'center',}}>{question.correctCount}</span>
                  <span style={{fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: '600', lineHeight: '21px', textAlign: 'center',}}>People answered correctly</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',width:'245px',height:'89px',borderRadius:'5px',background:'#FFFFFF',color:'#474444'}}>
                  <span  style={{fontFamily: 'Poppins, sans-serif', fontSize: '30px', fontWeight: '600', lineHeight: '45px', textAlign: 'center',}}>{question.incorrectCount}</span>
                  <span style={{fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: '600', lineHeight: '21px', textAlign: 'center',}}>People answered incorrectly</span>
                </div>
              </div>
              <div>
                <img src={HzLine} style={{margin:'20px',left:'-50px',position:'absolute'}}/>
              </div>
              
              </div>
            ) : question.questionType === "Poll" ? (
              <div>
                <div className="poll-options" style={{display:'flex',flexDirection:'row',gap:'25px'}}>
                {question.options.map((option, oIndex) => (
                  <div key={option._id} className="poll-option"  style={{display:'flex',flexDirection:'row',width:'245px',height:'89px',
                  borderRadius:'5px',background:'#FFFFFF',color:'#474444',gap:'20px',alignItems:'center'}}>
                    <span  style={{marginLeft:'20px',fontFamily: 'Poppins, sans-serif', fontSize: '30px', fontWeight: '600', lineHeight: '45px', textAlign: 'center',}}>{option.selectedCount}</span>
                    <span style={{fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: '600', lineHeight: '21px', textAlign: 'center',}}>{option.text}</span>
                  </div>
                ))}
              </div>
              <img src={HzLine} style={{margin:'50px',left:'-50px',position:'absolute'}}/>
              </div>
              
            ) : null}
          </div>
        ))}
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
                              </div>
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

export default QuestionAnalysisPage;
