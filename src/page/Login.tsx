import React, {useEffect, useState} from 'react';
import { User, Lock } from 'lucide-react';
import {backendUrl, UserType} from "./Admin.tsx";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        const loginRequest = {
            username: email,
            password: password,
        }
        try{
            const response =await fetch(`${backendUrl}/api/user/login`, {
                method: 'POST',
                body: JSON.stringify(loginRequest),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const user :UserType= await response.json();
            if(user){
                localStorage.setItem('userId', String(user.id));
                window.location.href=`/user/${user.id}`
            }
        }catch(err){
            console.log(err);
        }
    };

    const handleGetUserFromLocalStorage = () => {
        const userId:string = localStorage.getItem('userId');
        if(userId){
            window.location.href=`/user/${userId}`
        }
    }

    useEffect(() => {
        handleGetUserFromLocalStorage()
    },[])

    return (
        <div className="min-h-screen  flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
                    <p className="text-sm text-gray-600 mt-2">
                        Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;