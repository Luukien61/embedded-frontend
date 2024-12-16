import React from 'react';
import {Route, Routes} from "react-router-dom";
import LoginPage from "../page/Login.tsx";
import Admin from "../page/Admin.tsx";
import UserProfile from "../page/UserPage.tsx";
import Screen31 from "../page/Screen3_1.tsx";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />}  />
            <Route path={"/admin"} element={<Admin/>}/>
            <Route path={"/user/:id"} element={<UserProfile/>}/>
            <Route index element={<Screen31/>}/>
        </Routes>
    );
};

export default AppRouter;