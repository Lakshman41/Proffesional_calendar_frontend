import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';

const Login = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } =useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (userLoggedIn) {
            navigate('/');
        }
    }, [userLoggedIn, navigate]);

    const collectData = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            setError('');
            try {
                const res=await doSignInWithEmailAndPassword(email, password);
                if(res){
                    let flag=0;
                    let result=await fetch(`http://localhost:5000/login/${email}`);
                    result= await result.json();
                    let name=result['name'];
                    localStorage.setItem('user', JSON.stringify({ name,email,flag}));
                    navigate('/');
                }
            } catch (error) {
                setError(error.message);
                setIsSigningIn(false);
            }
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            setError('');
            try {
                const result=await doSignInWithGoogle();
                // Extract user information
                const user=result.user;
                setEmail(user.email);
                console.warn(email);
                //const name = user.displayName;
                if(result){
                    let flag=0;
                    let res=await fetch(`http://localhost:5000/login/${email}`);
                    res= await res.json();
                    let name=res['name'];
                    localStorage.setItem('user', JSON.stringify({ name,email,flag}));
                    navigate('/');
                }

            } catch (error) {
                setError(error.message);
                setIsSigningIn(false);
            }
        }
    };

    return (
        <div className="register">
            <div>
                <h1>Login</h1>

                <input 
                    className="inputBox"
                    type="text"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter Email ID" 
                />
                
                <input 
                    className="inputBox"
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter password" 
                />

                <button 
                    onClick={collectData} 
                    className="signbutton"
                    type="button"
                    disabled={isSigningIn}
                >
                    {isSigningIn ? 'Logging in...' : 'Login'}
                </button>

                {error && 
                    <div className="error-message" id="message">
                        {error}
                    </div>
                }

                <div className="flex items-center justify-center mb-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <div className="mx-4 text-sm font-bold text-gray-500">OR</div>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <button
                    disabled={isSigningIn}
                    onClick={onGoogleSignIn}
                    className="w-full py-2 border border-gray-300 rounded text-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_17_40)">
                            <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                            <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                            <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                            <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                        </g>
                        <defs>
                            <clipPath id="clip0_17_40">
                                <rect width="48" height="48" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    {isSigningIn ? 'Signing In...' : 'Continue with Google'}
                </button>
            </div>
        </div>
    );
};

export default Login;