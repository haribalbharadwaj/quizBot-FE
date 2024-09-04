import React from "react";
import Hz from '../assets/Hz.png'
import { useNavigate } from "react-router-dom";
import { useState ,useRef} from "react";
import { useEffect } from "react";
import axios from 'axios';
import Delete from '../assets/delete.png'
import Views from '../assets/Views.png'
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Dashboard (){

    const [isCreateQuizVisible, setIsCreateQuizkVisible] = useState(false);
    const [isQABlockVisible,setIsQABlockVisible]= useState(false);
    const [isPollBlockVisible,setIsPollBlockVisible]= useState(false);
    const [clickedButton, setClickedButton] = useState(null);
    const [quizName , setQuizName]= useState('');
    const [circles, setCircles] = useState([{ number: 1, questionData: { question: '', options: [] } }]);
    const [currentCircleIndex, setCurrentCircleIndex] = useState(0);
    const [qAQuestion,setQAQuestion]=useState('');
    const [pollQuestion,setPollQuestion] = useState('');
    const [selectedDot, setSelectedDot] = useState(0);
    const [option, setOption] = useState([{ text: '' }]);
    const [inputFields, setInputFields] = useState([]);
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
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [topPosition, setTopPosition] = useState(300);
  const [isPublishedVisible,setIsPublishedVisible] = useState(false);
  const [createdQuizId, setCreatedQuizId] = useState(null);
  const [editQuizType, setEditQuizType] = useState('');
  const [timer, setTimer] = useState(null); // State for managing the timer
  const [timerOption, setTimerOption] = useState('off');
  const [quizzes , setQuizzes]= useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizViews,setQuizViews]= useState('');
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [inputVisibilityState, setInputVisibilityState] = useState(false);
  const [currentInputs, setCurrentInputs] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [unsavedQuestion, setUnsavedQuestion] = useState(null);
  const [currentQuestionInput, setCurrentQuestionInput] = useState({
    question: '',
    options: [],
    correctAnswerIndex: null,
});
     const navigate = useNavigate();
     
    const [error, setError] = useState({
        quizName: false,
        qAQuestion:false,
        pollQuestion:false

    })

    useEffect(() => {
      const handleScroll = () => {
        // Calculate the new top position based on the scroll position
        const newTop = window.scrollY + 100; // Adjust this offset as needed
        
        // Ensure the top position doesn't go below 300px
        setTopPosition(Math.max(newTop, 300));
      };
  
      // Add the scroll event listener
      window.addEventListener('scroll', handleScroll);
  
      // Cleanup the event listener on component unmount
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    // console.log('Current clickedButton:', clickedButton);

    useEffect(() => {
      console.log("Input visibility state:", inputVisibilityState);
    }, [inputVisibilityState]);
    


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
  

  
  


    const popupRef = useRef(null);
    const logoutHandler = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
       navigate('/');
    };

    const createQuiz = () => {
       setIsCreateQuizkVisible(true);
    };
    
    const closeCreateQuiz = ()=>{
        setIsCreateQuizkVisible(false);
    }

    const addCircle = () => {
      const updatedCircles = [...circles];
      
      // Only save if the current circle has been filled out, to avoid overwriting data
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
  
      // Add a new circle with an incremented number
      const newCircle = { number: circles.length + 1, questionData: { question: '', options: [] } };
      setCircles([...updatedCircles, newCircle]);
  
      // Update state for the new circle
      setCurrentCircleIndex(circles.length);
      setQAQuestion('');  // Clear QA question input
      setInputs([]);  // Clear options
      setCorrectAnswerIndex(null);  // Clear correct answer selection
  };
  

 
  
  const handleCircleClick = (index) => {
      const circle = circles[index];
      setCurrentCircleIndex(index);
  
      // Populate input fields with the selected circle's data
      setQAQuestion(circle.questionData.question || '');
      setPollQuestion(circle.questionData.question || '');
      setInputs(circle.questionData.options || []);
      setCorrectAnswerIndex(circle.questionData.correctAnswerIndex || null);
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
                type: 'Qna',
                question: qAQuestion,
                options: inputs,
                correctAnswerIndex: correctAnswerIndex,
                timer: timerValue // Ensure timer is saved here
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
                type: 'Poll',
                question: pollQuestion,
                options: pollOptions,
                timer: 0 // Poll questions don't have a timer, or set to 0
            }
        };
    }

    setCircles(updatedCircles); // Set updated state
    console.log('Question saved:', updatedCircles[currentCircleIndex]);
    
    // Reset fields
    setQAQuestion('');
    setPollQuestion('');
    setInputs([]);
    setCorrectAnswerIndex(null);
}

  

    const closeQAblock =()=>{
      setIsQABlockVisible(false);
      setTimer(null);
    }

    const closePublishBlock =()=>{
      setIsPublishedVisible(false);
    }

    const handleTimerOptionChange = (option) => {
      setTimerOption(option);
      if (option === '5secs') {
          setTimer(5);
      } else if (option === '10secs') {
          setTimer(10);
      } else if (option === 'off') {
          setTimer(0);
      } else {
          setTimer(null);
      }
  };

  

    // Validation for PollQuestion
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

  // Validation
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

  // Filter out any incomplete or empty questions
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

  //console.log('Timer Value on Save:', questionData.timer);
  //console.log('Timer Value on Submit:', circle.questionData.timer);


  const quizData = {
      quizName,
      questions: validQuestions
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
      console.log("Quiz data sent:", quizData);

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



  
 
//console.log('Clicked Button:', clickedButton);
//console.log('QA Question:', qAQuestion);
//console.log('Poll Question:', pollQuestion);

  
  
        const handleAnalysis =()=>{
          navigate('/quizzes');
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
            
              console.log('Quizdata',response.data);
              
              
              const userId = localStorage.getItem('userId');
              const userResponse = await axios.get(`${backendUrl}/user/user/${userId}`, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });


              
      
              // Set user stats
              setUserStats(userResponse.data.data);
              setLoading(false);

              console.log('User Stats:', userStats);
              console.log('Quizzes:', quizzes);
            } catch (error) {
              console.error('Error fetching quizzes:', error);
              setError('Error fetching quizzes');
              setLoading(false);
            }
          };
      
          fetchQuizzes();
        }, []);

        useEffect(() => {
          // Calculate total impressions across all quizzes
          const calculateTotalImpressions = () => {
              return quizzes.reduce((total, quiz) => {
                  const quizImpressions = quiz.questions.reduce((sum, question) => sum + (question.totalImpressions || 0), 0);
                  return total + quizImpressions;
              }, 0);
          };
      
          setTotalImpressions(calculateTotalImpressions());
      }, [quizzes]);

      const handleCopyLink = () => {
        const quizLink = `${window.location.origin}/quiz/${createdQuizId}`;
        navigator.clipboard.writeText(quizLink)
          .then(() => {
            toast.success('Link copied to clipboard!', {
              position: 'top-right',
            });
          })
          .catch((err) => {
            toast.error('Failed to copy the link!', {
              position: 'bottom-right',
            });
            console.error('Failed to copy the link: ', err);
          });
      };
      
      

     
      

   
      
    
    return(
        <div style={{width:'1280px',height:'832px',margin: '0 auto',display:'flex',flexDirection:'row'}}>
            <div style={{width:'193px',height:'832px',background:'#FFFFFF',boxShadow:'0px 4px 4px 0px #00000040'}}>
              <span style={{fontFamily: 'Jomhuria,sans-serif',fontSize: '70px',fontWeight:'400',lineHeight:'100px',textAlign:'left',
                color:'#474444',left:'20px',position:'absolute'
              }}>QUIZZIE</span>
                
              <div style={{display:'flex',flexDirection:'column',gap:'50px',top:'309px',position:'absolute',left:'90px'            }}>
                <span style={{fontFamily:'Poppins,sans-serif',fontSize:'20px',fontWeight:'600',lineHeight:'30px',textAlign:'center',color:'#474444'}}>Dashboard</span>
                <span onClick={handleAnalysis} style={{fontFamily:'Poppins,sans-serif',fontSize:'20px',fontWeight:'600',lineHeight:'30px',textAlign:'center',color:'#474444'}}>Analytics</span>
                <span onClick={createQuiz} style={{fontFamily:'Poppins,sans-serif',fontSize:'20px',fontWeight:'600',lineHeight:'30px',textAlign:'center',color:'#474444'}}>Create Quiz</span>   
              </div>

              <img src={Hz} style={{top:'763px',left:'90px',position:'absolute'}}/>
              <span onClick={logoutHandler} style={{width:'83px',height:'30px',top:'786px',left:'110px',fontFamily:'Poppins,sans-serif',fontSize:'20px',fontWeight:'700',lineHeight:'30px',textAlign:'center',position:'absolute'}}>LOGOUT</span>

            </div>
            <div style={{width:'1087px',height:'832px',left:'193px',background:'#EDEDED'}}>
              <div>
                <div className="user-stats">
                  {userStats && (
                    <div style={{display:'flex',flexDirection:'row',gap:'50px',width:'925px',height:'150px',top:'111px',left:'350px',
                      position:'absolute'
                    }}>
                      <div style={{display:'flex',flexDirection:'column',width:'295px',height:'145px',borderRadius:'10px',background:'#FFFFFF',textAlign:'left'}}>
                        <div style={{display:'flex',flexDirection:'row',gap:'20px'}}>
                          <span style={{marginLeft:'30px',fontFamily:'Poppins,sans-serif',fontSize: '60px',fontWeight: '600',lineHeight:'90px',textAlign:'left',color:'#FF5D01'}}>{userStats.quizzesCreated}</span>
                          <span style={{marginTop:'30px',fontFamily:'Poppins,sans-serif',fontSize: '30px',fontWeight: '500',lineHeight:'45px',textAlign:'left',color:'#FF5D01'}}>Quiz</span>
                        </div>
                        <span style={{marginLeft:'30px',fontFamily:'Poppins,sans-serif',fontSize: '30px',fontWeight: '500',lineHeight:'45px',textAlign:'left',color:'#FF5D01'}}>Created</span>
                      </div>

                      <div style={{display:'flex',flexDirection:'column',width:'295px',height:'145px',borderRadius:'10px',background:'#FFFFFF',textAlign:'left'}}>
                        <div style={{display:'flex',flexDirection:'row',gap:'5px'}}>
                          <span  style={{marginLeft:'10px',fontFamily:'Poppins,sans-serif',fontSize: '60px',fontWeight: '600',lineHeight:'90px',textAlign:'left',color:'#60B84B'}}>{userStats.totalQuestions}</span>
                          <span style={{marginTop:'30px',fontFamily:'Poppins,sans-serif',fontSize: '30px',fontWeight: '500',lineHeight:'45px',textAlign:'left',color:'#60B84B'}}>questions</span>
                        </div>
                        <span style={{marginLeft:'10px',fontFamily:'Poppins,sans-serif',fontSize: '30px',fontWeight: '500',lineHeight:'45px',textAlign:'left',color:'#60B84B'}}>Created</span>
                      </div>

                      <div style={{display:'flex',flexDirection:'column',width:'295px',height:'145px',borderRadius:'10px',background:'#FFFFFF',textAlign:'left'}}>
                        <div style={{display:'flex',flexDirection:'row',gap:'20px'}}>
                          <span  style={{marginLeft:'30px',fontFamily:'Poppins,sans-serif',fontSize: '60px',fontWeight: '600',lineHeight:'90px',textAlign:'left',color:'#5076FF'}}>
                            {totalImpressions > 1000 ? `${(totalImpressions / 1000).toFixed(1)}k` : totalImpressions}
                          </span>
                            <span  style={{marginTop:'30px',fontFamily:'Poppins,sans-serif',fontSize: '30px',fontWeight: '500',lineHeight:'45px',textAlign:'left',color:'#5076FF'}}>Total</span>
                        </div>
                        <span  style={{marginLeft:'30px',fontFamily:'Poppins,sans-serif',fontSize: '30px',fontWeight: '500',lineHeight:'45px',textAlign:'left',color:'#5076FF'}}>Impressions</span>
                      </div>

                    </div>
                  )}
                </div>

                <div className="quiz-list" style={{width:'1000px',height:'353px',top:'361px',left:'283px',position:'absolute', overflowY: 'scroll' }}>
                  <span style={{fontFamily:'Poppins,sans-serif',fontSize: '30px',fontWeight: '500',lineHeight:'45px',textAlign:'left',color:'#474444',
                    left:'70px',position:'absolute'
                  }}>Trending Quizs</span>
                   <div style={{display: 'grid',gridTemplateColumns: 'repeat(4, 1fr)',gap: '40px',top:'87px',left:'70px',position:'absolute'}}>
                        {quizzes.length > 0 ? (
                            quizzes.map((quiz) => (
                              
                                   <div key={quiz._id}  style={{display:'flex',flexDirection:'column',width:'181px',height:'62px',background:'#FFFFFF'}}>
                                    <div style={{display:'flex',flexDirection:'row',gap:'10px'}}>
                                       <span style={{fontFamily:'Poppins,sans-serif',fontSize: '23px',fontWeight: '600',lineHeight:'34.5px',textAlign:'left',color:'#474444'}}>{quiz.quizName}</span>
                                        <div style={{display:'flex',flexDirection:'row',gap:'10px',width:'51px',height:'23px',top:'11px',left:'25px',position:'relative'}}>
                                          <span style={{fontFamily:'Poppins,sans-serif',fontSize: '15px',fontWeight: '600',lineHeight:'22.5px',textAlign:'left',color:'#FF5D01'}}>{quiz.views}</span>
                                          <img src={Views}/>
                                        </div>
                                    </div>
                                    <div  style={{width:'150px',fontFamily:'Poppins,sans-serif',fontSize: '11px',fontWeight: '600',lineHeight:'16.5px',textAlign:'center',color:'#60B84B',display:'flex',flexDirection:'row'}}>
                                      <span>Created on : </span>
                                    <span>
                                      {`${new Date(quiz.createdDate).getDate()} ${new Date(quiz.createdDate).toLocaleString('en-US', { month: 'short' })}, ${new Date(quiz.createdDate).getFullYear()}`}
                                    </span>
                                    </div>
                                   
                                </div>
                  
                            ))
                        ) : (
                          
                            <></>
                        )}
                     </div>
                </div>
      
      

      
            </div>
            </div>


            {isCreateQuizVisible && (
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
                        <button  onClick={() => { handleInputsBlock()}} style={{width:'279px',height:'46.14px',top:'571px',left:'315px',borderRadius:'10px',boxShadow:'0px 0px 15px 0px #00000040',background:'#60B84B',color:'#FFFFFF',
                             fontFamily:'Poppins,sans-serif',fontSize: '25px',fontWeight: '500',lineHeight:'37.5px',textAlign:'center',border: 'none', outline: 'none'}}>Continue</button>
                    </div>

                </div>
                 </div>
            )}

        
             {isQABlockVisible && (
              <div>
                  <div className="overlay" style={{ width: '100vw', position: 'fixed', top: '0', left: '0', height: '200vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
                  <div style={{width:'845px',height:'671px',top:'83px',left:'250px',position:'absolute',background:'#FFFFFF'}}>
                      <div>
                          <div className="circle"  style={{ display: 'flex', gap: '10px', flexWrap: 'wrap',top:'43px',left:'94px',position:'absolute'}}>
                            {circles.map((circle, index) => (
                                <div key={index} className="circle" style={{width: '58px',height: '58px',borderRadius: '50%', backgroundColor: currentCircleIndex === index ? '#4CAF50' : '#E0E0E0',
                                    display: 'flex',alignItems: 'center',justifyContent: 'center',color:currentCircleIndex === index ? '#FFFFFF' : '#9F9F9F',boxShadow:'0px 0px 10px 0px #00000026',
                                    fontFamily:'Poppins,sans-serif',fontSize: '20px',fontWeight: '500',lineHeight:'37.5px'}} onClick={() => handleCircleClick(index)}>
                                    {circle.number}
                                </div>
                            ))}
                            {circles.length <= 5 && (<div className="circle" onClick={addCircle} style={{width: '58px',height: '58px',borderRadius: '50%',background: '#FFFFFF',display: 'flex',
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
              {circles.length <= 5 && (<div className="circle" onClick={addCircle} style={{width: '58px',height: '58px',borderRadius: '50%',background: '#FFFFFF',display: 'flex',
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
      {inputs.map((input, index) => (
      <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}
      onClick={() => handleSelectCorrectAnswer(index)} >

        <div  style={{width: '12px',height: '12px',borderRadius: '50%',border: '2px solid #9F9F9F',backgroundColor: correctAnswerIndex === index ? '#60B84B' : '#FFFFFF'}}>
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
        value={input.text || ''}
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
                 <div className="overlay" style={{ width: '100vw', position: 'fixed', top: '0', left: '0', height: '200vh', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                
               </div>

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
                      <ToastContainer 
                      style={{top:'27px',position:'absolute'}}/>
                 </div>
              </div>
            )}
        </div>
    )
}

export default Dashboard;