import {createRoot} from 'react-dom/client'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./router/AppRouter.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AppRouter/>
    </BrowserRouter>
)
