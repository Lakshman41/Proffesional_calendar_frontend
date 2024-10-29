import React,{useState,useEffect} from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const Update_Event=()=>{
    const [title,setTitle]=useState();
    const [date,setdate]=useState();
    const [time,settime]=useState();
    const [description,setdescription]=useState();
    const { userLoggedIn } =useAuth();
    const navigate=useNavigate();
    const params=useParams();

    useEffect(() => {
        if (!userLoggedIn) {
            navigate('/');
        }
    }, [userLoggedIn, navigate]);

    useEffect(()=>{
        console.warn(params);
        getEventDetails();
    },[])

    const getEventDetails=async()=>{
        console.warn(params)
        let result = await fetch(`http://localhost:5000/list/${params.id}`);
        result =await result.json();
        console.warn(result)
        setTitle(result['title']);
        setdate(new Date(result.date).toISOString().split('T')[0]);
        settime(result['time']);
        setdescription(result['description']);
    }

    const collectData=async ()=>{
        let result= await fetch(`http://localhost:5000/list/${params.id}`,{
        method:'Put',
        body:JSON.stringify({title,date,time,description}),
        headers:{
            'Content-Type':"application/json"
        }
        });
        result=await result.json();
        navigate('/View');
    }

    return(
        <div className="register">
            <h1>Update Event</h1>

            <input className="inputBox" type="text"
            value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Update Title" />
            
            <input className="inputBox" type="date" 
            value={date} onChange={(e)=>setdate(e.target.value)} placeholder="Update Date" />

            <input className="inputBox" type="time" 
            value={time} onChange={(e)=>settime(e.target.value)} placeholder="Update time" />
            <div  className="limit">max limit(200)</div>
            <textarea className="description" type="text" rows="6" maxLength={200}
            value={description} onChange={(e)=>setdescription(e.target.value)} placeholder="Update Description" />                     

            <button onClick ={collectData} className="signbutton" type="button">Update</button>

            <span classname="error-message" id="message"></span>

        </div>
    )
}
export default Update_Event;