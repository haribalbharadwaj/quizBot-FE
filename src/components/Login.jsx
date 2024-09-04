import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState({
    email: false,
    password: false,
  });

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setError((prevState) => {
        return{ 
            ...prevState,
            email:false,
            password:false,
            message: ''
        }
    })

    if(!email){
        setError((prevState)=>{
            return{
            ...prevState,
            email:true
            }
        })
    }

    if(!password){
        setError((prevState)=>{
            return{
            ...prevState,
            password:true
            }
        })
    }

    if(!email ||!password){
        console.log("Error in login")
        return;
    }

   
    console.log(email);
    

    const userData = {email,password}

    try {
      const backendUrl = process.env.REACT_APP_QUIZBOT_BACKEND_URL;
          if (!backendUrl) {
              throw new Error('Backend URL is not defined');
          }
      const response = await axios.post(`${backendUrl}/user/login`, userData, {
          headers: {
              'Content-Type': 'application/json'
          }
      });

     

      console.log('Response data:', response.data);

      
      // Handle other response data like token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name',response.data.name);
      localStorage.setItem('userId', response.data.userId); 

      console.log('userId:',response.data.userId);
      console.log("token:",response.data.token);

      console.log('User login successfully', response.data);
      setSuccess('Login successfully!');
      setError((prevState) => ({ ...prevState, message: '' }));

      navigate('/dashboard');

      // Optionally clear the form fields
  } catch (error) {
      console.error('Error submitting form', error);
      if (error.response) {
        setError((prevState) => ({
          ...prevState,
          message: error.response.data.message || 'Failed to login. Please try again.'
      }));
      } else if (error.request) {
          console.error('Request data:', error.request);
          setError((prevState) => ({
            ...prevState,
            message: 'No response received from the server. Please try again.'
        }));
      } else {
          setError((prevState) => ({
            ...prevState,
            message: error.message || 'An error occurred. Please try again.'
        }));
      }
      setSuccess('');
  }
};

const handleRegister=()=>{
  navigate('/');
}

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Full viewport height
      background: '#FFFFFF'
    }}>
      <div style={{
        width: '1066px',
        height: '611px',
        borderRadius: '15px',
        boxShadow: '0px 0px 30px 0px #00000026',
        background: '#FFFFFF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'column'
      }}>

<div style={{width:'187px',height:'100px',top:'100px',left:'650px',position:'absolute'}}>
            <span style={{fontFamily: 'Jomhuria,sans-serif',fontSize: '100px',fontWeight:'400',lineHeight:'100px',textAlign:'left',
              color:'#474444'
            }}>
            QUIZZIE
            </span>
          </div>
          <div style={{width: '700px',height:'37px',top:'250px',left:'32%',display:'flex',flexDirection:'row',position:'absolute',
            gap:'50px'
          }}>
            <button style={{width:'217px',height:'37px',top:'267px',left:'422px',borderRadius:'10px',background:'#FFFFFF',
             color:'#474444',fontFamily:'Poppins,sans-serif',borderColor:'#FFFFFF',
              fontSize:'20px',fontWeight:'600',lineHeight:'30px',textAlign:'center'              
            }} onClick={handleRegister}>Sign Up</button>

            <button style={{width:'217px',height:'37px',top:'267px',left:'619px',borderRadius:'10px',background:'#FFFFFF',
              boxShadow: '0px 0px 50px 0px #0019FF3D',color:'#474444',fontFamily:'Poppins,sans-serif',borderColor:'#FFFFFF',
              fontSize:'20px',fontWeight:'600',lineHeight:'30px',textAlign:'center'              
            }}>Log In</button>

          </div>
        <div className='container' style={{ width: '518px', height: '107px',top:'20px', position: 'relative',left:'-15px' }}>
  <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
    
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <p style={{
        width: '150px',
        color: '#474444',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '20px',
        fontWeight: '600',
        textAlign: 'right',
        marginRight: '10px'
      }}>Email</p>
      <input style={{
        width:'388px',
        height: '30px',
        borderRadius: '10px',
        border: error.email ? '1px solid #D60000' : '1px solid #F4F4F4',
        background: '#F4F4F4',
        color: '#474444',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '18px',
        paddingLeft: '10px',
      }}
        id="email"
        type="email"
        name="email"
        autoComplete='off'
        placeholder={error.email ? "Invalid Email" : " "}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <p style={{
        width: '150px',
        color: '#474444',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '20px',
        fontWeight: '600',
        textAlign: 'right',
        marginRight: '10px'
      }}>Password</p>
      <input style={{
        width: '388px',
        height: '30px',
        borderRadius: '10px',
        border: error.password ? '1px solid #D60000' : '1px solid #F4F4F4',
        background: '#F4F4F4',
        color: '#474444',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '18px',
        paddingLeft: '10px',
      }}
        id="password"
        name="password"
        type="password"
        autoComplete='off'
        placeholder={error.password ? "Weak password" : " "}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  </form>
</div>

<div style={{ textAlign: 'center' }}>
      <button type="submit" style={{
        width: '274px', height: '40px', borderRadius: '8px', background: '#A0C4FF', color: '#474444',
        fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: '600', cursor: 'pointer', border: 'none',
        top:'500px',position:'absolute',left:'42%'
      }} onClick={handleSubmit}>
        Log In
      </button>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error.global && <p style={{ color: 'red' }}>{error.global}</p>}
    </div>

      </div>
    </div>
  );
}

export default Signup;
