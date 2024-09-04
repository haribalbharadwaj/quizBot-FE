import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    passwordMatch: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newError = {
      name: !name,
      email: !email,
      password: !password,
      confirmPassword: !confirmPassword,
      passwordMatch: password !== confirmPassword,
    };

    setError(newError);

    if (Object.values(newError).includes(true)) {
      console.log("Error exists in the form");
      return;
    }

    const userData = {
      name,
      email,
      password,
      confirmPassword,
    };

    try {
      const backendUrl = process.env.REACT_APP_QUIZBOT_BACKEND_URL;
      if (!backendUrl) {
        throw new Error('Backend URL is not defined');
      }

      const response = await axios.post(`${backendUrl}/user/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const userId = response.data.userId;
      if (userId) {
        localStorage.setItem('userId', userId);
        console.log('User ID stored in localStorage:', userId);
        
        // Redirect to workspace after successful signup
        navigate('/login');
      } else {
        console.error('User ID not found in response');
      }

      console.log('Form submitted successfully', response.data);
      setSuccess('Account created successfully!');
      setError({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
        passwordMatch: false,
      });
      
    } catch (error) {
      console.error('Error submitting form', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        setError({ ...error, global: `Failed to create account: ${error.response.data.message || 'Please try again.'}` });
      } else if (error.request) {
        console.error('Request data:', error.request);
        setError({ ...error, global: 'No response received from the server. Please try again.' });
      } else {
        console.error('Error message:', error.message);
        setError({ ...error, global: `Failed to create account: ${error.message}. Please try again.` });
      }
      setSuccess('');
    }
  };

  const handleLogin=()=>{
    navigate('/login');
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

<div style={{width:'187px',height:'100px',top:'80px',left:'635px',position:'absolute'}}>
            <span style={{fontFamily: 'Jomhuria,sans-serif',fontSize: '100px',fontWeight:'400',lineHeight:'100px',textAlign:'left',
              color:'#474444'
            }}>
            QUIZZIE
            </span>
          </div>
          <div style={{width: '417px',height:'37px',top:'267px',left:'50%',display:'flex',flexDirection:'row'}}>
            <span style={{width:'217px',height:'37px',top:'267px',left:'422px',borderRadius:'10px',background:'#FFFFFF',
              boxShadow: '0px 0px 50px 0px #0019FF3D',color:'#474444',fontFamily:'Poppins,sans-serif',borderColor:'#FFFFFF',
              fontSize:'20px',fontWeight:'600',lineHeight:'30px',textAlign:'center'              
            }}>Sign Up</span>

            <span style={{width:'217px',height:'37px',top:'267px',left:'619px',borderRadius:'10px',background:'#FFFFFF',
              boxShadow: '0px 0px 50px 0px #0019FF3D',color:'#474444',fontFamily:'Poppins,sans-serif',borderColor:'#FFFFFF',
              fontSize:'20px',fontWeight:'600',lineHeight:'30px',textAlign:'center'              
            }} onClick={handleLogin}>Log In</span>

          </div>
        <div className='container' style={{ width: '606px', height: '245px',top:'70px', position: 'relative' }}>
  <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
      <p style={{
        width: '150px',
        color: '#474444',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '20px',
        fontWeight: '600',
        textAlign: 'right',
        marginRight: '10px',
        marginTop: '0' // Ensure it's at the top of the c
      }}>Name</p>
      <input style={{
        width:'388px',
        height: '38px',
        borderRadius: '10px',
        border: error.name ? '1px solid #D60000' : '1px solid #F4F4F4',
        background: '#F4F4F4',
        color: '#474444',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '18px',
        paddingLeft: '10px',
      }}
        id="name"
        type="text"
        name="name"
        autoComplete='off'
        placeholder={error.name ? "Invalid name" : " "}
        value={name}
        onChange={(e) => setName(e.target.value)}
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

    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0' }}>
      <p style={{
        width: '187px',
        color: '#474444',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '20px',
        fontWeight: '600',
        textAlign: 'right',
        marginRight: '10px',
        marginTop: '10px', // Adjust margin to fit within the container
        marginLeft:'-40px'
      }}>Confirm Password</p>
      <input style={{
        
        width:'388px',
        height: '30px',
        borderRadius: '10px',
        border: error.confirmPassword ? '1px solid #D60000' : '1px solid #F4F4F4',
        background: '#F4F4F4',
        color: error.confirmPassword ? 'red' : 'initial',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '18px',
        paddingLeft: '10px',
      }}
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        autoComplete='off'
        placeholder={error.confirmPassword ? "Passwords do not match" : " "}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </div>
  </form>
</div>

<div style={{ textAlign: 'center' }}>
      <button type="submit" style={{
        width: '274px', height: '40px', borderRadius: '8px', background: '#A0C4FF', color: '#FFFFFF',
        fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: '600', cursor: 'pointer', border: 'none',
        top:'600px',position:'absolute',left:'635px'
      }}onClick={handleSubmit}>
        Sign Up
      </button>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error.global && <p style={{ color: 'red' }}>{error.global}</p>}
    </div>


      </div>
    </div>
    
  );
}

export default Signup;
