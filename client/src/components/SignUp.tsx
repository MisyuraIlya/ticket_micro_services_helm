'use client'
import axios from 'axios';
import React, { useState } from 'react';

const SignUp = () => {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const handleClick = async () => {
        try {
            const response = await axios.post('/api/users/signup', {
                email,password
            })
        } catch(e: any) {
            setErrors(e.response.data.errors)
        }
    
    }
    
    return (
        <div>
            <div>
                <h1>sign up</h1>
                <div>
                    <input placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button onClick={() => handleClick()}>
                        sign up
                    </button>
                    <h4>errors:</h4>
                    <ul>
                        {errors?.map((item: any,key) => 
                            <li key={key}>
                                {item?.message}
                            </li>
                        )}
                    </ul>
            
                </div>
            </div>
        </div>
    );
};

export default SignUp;