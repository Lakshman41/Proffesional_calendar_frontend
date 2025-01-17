import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';

const SignUp =()=>{
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [isRegistering,setIsRegistering]=useState(false);
    const { userLoggedIn } =useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (userLoggedIn) {
            navigate('/');
        }
    }, [userLoggedIn, navigate]);

    const collectData=async (e)=>{
        e.preventDefault();
        if(!isRegistering){
            setIsRegistering(true);
            const res=await doCreateUserWithEmailAndPassword(email, password);
            if(res){
                let result=await fetch('http://localhost:5000/register',{
                    method: 'post',
                    body: JSON.stringify({name,email}),
                    headers:{
                        'Content-Type':'application/json'
                    }
                });
                //localStorage.setItem('user',JSON.stringify({name,email_id}));
                result = await result.json();
                let flag=0;
                localStorage.setItem('user', JSON.stringify({ name,email,flag}));
                if(result['message']) document.getElementById("message").innerText = result['message'];
                //console.warn(result);
                if(result['message']==='Registered'){
                    navigate('/');
                }
            }
        }
    }

    return(
        <div className="register">
            <h1>Register</h1>
            <input className="inputBox" type="text" 
            value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter Name" />

            <input className="inputBox" type="text"
            value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email ID" />
            
            <input className="inputBox" type="password" 
            value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter password" />

            <button onClick ={collectData} className="signbutton" type="button">Sign Up</button>

            <span classname="error-message" id="message"></span>

        </div>
    )
}

export default SignUp;