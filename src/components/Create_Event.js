import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const Create_Event=()=>{
    const [Title,setTitle]=useState();
    const [date,setdate]=useState();
    const [time,settime]=useState();
    const [description,setdescription]=useState();
    const navigate=useNavigate();
    const { userLoggedIn } =useAuth();

    useEffect(() => {
        if (!userLoggedIn) {
            navigate('/');
        }
    }, [userLoggedIn, navigate]);

    const collectData=async ()=>{
        //console.warn(email_id,password)
        const user = localStorage.getItem('user');
        const userData = JSON.parse(user);
        const email_id=userData.email;
        console.log(email_id);
        let result=await fetch('http://localhost:5000/create',{
            method: 'post',
            body: JSON.stringify({email_id,Title,date,time,description}),
            headers:{
                'Content-Type':'application/json'
            }
        });
        result = await result.json();
        document.getElementById("message").innerText = result['message'];
    }

    return(
        <div className="register">
            <h1>Create Event</h1>

            <input className="inputBox" type="text"
            value={Title} onChange={(e)=>setTitle(e.target.value)} placeholder="Enter Title" />
            
            <input className="inputBox" type="date" 
            value={date} onChange={(e)=>setdate(e.target.value)} placeholder="Enter Date" />

            <input className="inputBox" type="time" 
            value={time} onChange={(e)=>settime(e.target.value)} placeholder="Enter time" />

            <div className="limit">max limit(200)</div>
            <textarea className="description" type="text" rows="6" maxLength={200}
            value={description} onChange={(e)=>setdescription(e.target.value)} placeholder="Enter Description" />                     

            <button onClick ={collectData} className="signbutton" type="button">Create</button>

            <span classname="error-message" id="message"></span>

        </div>
    )
}
export default Create_Event;