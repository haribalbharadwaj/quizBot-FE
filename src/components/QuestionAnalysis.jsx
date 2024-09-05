import React, { useEffect, useState ,useRef} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Use useParams for route params
import HzLine from '../assets/HzLine.png';


const QuestionAnalysis = ({quizId}) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!quiz) return <p>No quiz data found.</p>;

  return (
    <div className="question-analysis">

      {/* Score page */}
      <div style={{width:'1087px',height:'832px',left:'193px',background:'#EDEDED',position:'absolute',top:'0px'}}>

      <div style={{display:'flex',flexDirection:'row',left:'79px',top:'57px',position:'absolute',gap:'100px'}}>

          <h1 style={{fontFamily: 'Poppins, sans-serif', fontSize: '40px', fontWeight: '600', lineHeight: '60px', textAlign: 'center', color: '#5076FF' }}>{quiz.quizName} Question Analysis</h1>
          <div style={{display:'flex',flexDirection:'column',fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: '600',
            color:'#FF5D01',gap:'0px',alignItems:'start'
          }}>
            <span>Created on:{`${new Date(quiz.createdDate).getDate()} ${new Date(quiz.createdDate).toLocaleString('en-US', { month: 'short' })}, ${new Date(quiz.createdDate).getFullYear()}`} </span>
            <span>Impressions: {quiz.questions.reduce((acc, q) => acc + q.totalImpressions, 0)}</span>
          </div>
      </div>

      <div className="questions" style={{overflowY:'scroll',maxHeight: '651px',margin: '0 auto',width:'1000px',top:'181px',position:'absolute',overflowX:'hidden'}}>
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
                    {option.imageUrl && (
                      <img src={option.imageUrl}  alt={`Option ${option.text}`}  style={{width: '60px',height: '60px',objectFit: 'cover',borderRadius: '5px',}} />
                      )}
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




    </div>
  );
};

export default QuestionAnalysis;
