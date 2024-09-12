import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import Cup from "../../assets/Cup.png"
import "../QuizPage/quizPage.css";

const QuizPage = () => {
  const { quizId } = useParams(); // Fetch the quizId from the UR
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerOption, setTimerOption] = useState('off');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isPoll, setIsPoll] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const backendUrl = process.env.REACT_APP_QUIZBOT_BACKEND_URL;
        console.log('Backend URL:', process.env.REACT_APP_QUIZBOT_BACKEND_URL);

        if (!backendUrl) {
          throw new Error('Backend URL is not defined');
        }

       

        console.log('QuizId:',quizId);

        const response = await axios.get(`${backendUrl}/quiz/quiz/${quizId}`, {
          headers: {
            'Content-Type': 'application/json'
          },
        });
        setQuiz(response.data);
        console.log("Quiz data:", response.data);
        setSelectedAnswers(Array(response.data.questions.length).fill(null));

        // Initialize timer based on the first question type
        const firstQuestion = response.data.questions[0];
        if (firstQuestion?.questionType === 'Poll') {
          setIsPoll(true);
        } else if (firstQuestion?.timer) {
          setTimer(firstQuestion.timer);
          setTimerOption('on');
        }
      } catch (error) {
        console.error("Error fetching the quiz:", error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    let interval;
    if (timerOption === 'on' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && timerOption === 'on') {
      handleNextClick();
    }
    return () => clearInterval(interval);
  }, [timer, timerOption, currentQuestionIndex]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleOptionClick = async (questionIndex, optionIndex) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(updatedAnswers);
  
    const currentQuestion = quiz?.questions[questionIndex];
    if (!currentQuestion) return;

    const selectedOption = currentQuestion.options[optionIndex];
    selectedOption.selectedCount = (selectedOption.selectedCount || 0) + 1;
  
    try {
      const backendUrl = process.env.REACT_APP_QUIZBOT_BACKEND_URL;
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in localStorage');
      }
      const questionId = currentQuestion._id;
      await axios.post(`${backendUrl}/quiz/recordAnswer`, {
          quizId: quiz._id,
          questionId: questionId,
          selectedOptionId: selectedOption._id,
          selectedCount: selectedOption.selectedCount+1
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

    } catch (error) {
      console.error('Error recording the answer:', error);
    }
  };

  const handleNextClick = () => {
    if (quiz && quiz.questions) {
      const currentQuestion = quiz.questions[currentQuestionIndex];
      if (currentQuestion?.questionType !== 'Poll') {
        // Move to the next question
        if (currentQuestionIndex < quiz.questions.length - 1) {
          const nextQuestion = quiz.questions[currentQuestionIndex + 1];
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          
          // Check if the next question has a timer
          if (nextQuestion?.questionType !== 'Poll' && nextQuestion?.timer) {
            setTimer(nextQuestion.timer);
            setTimerOption('on');
          } else {
            setTimer(0);
            setTimerOption('off');
          }
        } else {
          handleSubmit();
        }
      } else {
        // Skip to the next question without timer
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        if (currentQuestionIndex === quiz.questions.length - 1) {
          handleSubmit();
        }
      }
    }
  };

  const handleSubmit = () => {
    if (!quiz || !quiz.questions) return;

    if (isPoll) {
      // If it's a poll, show the thank you message
      setQuizCompleted(true);
    } else {
      // Calculate score for non-poll quizzes
      const correctAnswers = quiz.questions.map((q) => q.correctAnswerIndex);
      const userScore = selectedAnswers.reduce(
        (total, answer, index) => total + (answer === correctAnswers[index] ? 1 : 0),
        0
      );
      setScore(userScore);
      setQuizCompleted(true);
    }
  };

  if (quizCompleted) {
    if (isPoll) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2 style={{color:'#474444', fontFamily: 'Poppins, sans-serif', fontSize: '2.5rem', fontWeight: '700'}}>Thank you for participating in the poll!</h2>
        </div>
      );
    }

    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2 style={{color:'#474444', fontFamily: 'Poppins, sans-serif', fontSize: '2.5rem', fontWeight: '700'}}>Congrats Quiz completed</h2>
        <img src={Cup} alt="Cup" style={{ maxWidth: '100%', height: 'auto' }} />

        <h3 style={{color:'#474444', fontFamily: 'Poppins, sans-serif', fontSize: '2rem', fontWeight: '700'}}>Your Score is</h3>
        <span style={{color:'#60B84B', fontFamily: 'Poppins, sans-serif', fontSize: '2rem', fontWeight: '700'}}>
          {score} / {quiz.questions.length}
        </span>
      </div>
    );
  }

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div style={{}} className='outer-container'>
      <div style={{ 
        background: '#FFFFFF', 
        borderRadius: '15px', 
        padding: '20px', 
        position: 'relative' 
      }} className='Mobile'>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <span style={{ 
            fontFamily: 'Poppins, sans-serif', 
            fontSize: '2rem', 
            fontWeight: '700'
          }}>
            {String(currentQuestionIndex + 1).padStart(2, '0')} / {String(quiz.questions.length).padStart(2, '0')}
          </span>

          {timerOption === 'on' && (
            <span style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#D60000'
            }}>
              {formatTime(timer)}
            </span>
          )}
        </div>

        <h2 style={{ 
          color: '#474444', 
          fontFamily: 'Poppins, sans-serif', 
          fontSize: '2rem', 
          fontWeight: '700', 
          textAlign: 'center' 
        }}>
          {currentQuestion.questionText}
        </h2>


        <div 
  style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(2, 1fr)', 
    gap: '10px',
  }}
>
  {currentQuestion.options.map((option, index) => (
    <div 
      key={index} 
      onClick={() => handleOptionClick(currentQuestionIndex, index)} 
      style={{ 
        cursor: 'pointer', 
        background:selectedAnswers[currentQuestionIndex] === index ? '#4CAF50' : '#F0F0F0',
        color: selectedAnswers[currentQuestionIndex] === index ? '#FFFFFF' : '#474444',
        borderRadius: '8px', 
        padding: '15px', 
        textAlign: 'center', 
        fontFamily: 'Poppins, sans-serif', 
        fontSize: '1.2rem', 
        fontWeight: '600', 
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        transition: 'background 0.3s',
      }}
    >
     {option.imageUrl && (
              <img src={option.imageUrl} alt={`Option ${index + 1}`} width="100" height="100"style={{ display: 'block', margin: 'auto' }}
                onError={(e) => {e.target.src = 'fallback_image_url';}}
              />
              ) }
                {option.text && (
      <span style={{
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontWeight: '600',
        lineHeight: '21px',
        textAlign: 'center',
      }}>
        {option.text}
      </span>
    )}
    </div>
  ))}
</div>

<style>
{`
  @media (max-width: 768px) {
    div[style*="grid-template-columns"] {
      grid-template-columns: 1fr !important;
    }
  }
`}
</style>


       

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '20px' 
        }}>
          <button 
            onClick={handleNextClick} 
            style={{ 
              background: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              padding: '10px 20px', 
              fontSize: '1.2rem', 
              fontFamily: 'Poppins, sans-serif', 
              cursor: 'pointer', 
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              transition: 'background 0.3s',
            }}
          >
            {isLastQuestion ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
