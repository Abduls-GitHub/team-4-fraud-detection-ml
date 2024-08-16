import './index.css'
import React from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LandingPage from "@/pages/landingPage.tsx";
import ClaimForm from "@/pages/claimForm.tsx";
import ReactDOM from 'react-dom/client'
import {Toaster} from "@/components/ui/toaster.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage/>,
    },
    {
        path: '/claim',
        element: <ClaimForm/>
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Toaster></Toaster>
        <RouterProvider router={router} />
    </React.StrictMode>,
)


