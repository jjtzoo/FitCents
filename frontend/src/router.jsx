import React from "react";
import { createBrowserRouter } from "react-router";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages - Public
import Home from "./pages/landing_page/Home";
import AboutUs from "./pages/landing_page/AboutUs";
import Login from "./pages/landing_page/Login"
import Register from "./pages/landing_page/Register";

// Pages - Shared/Dashboard
import UserData from "./pages/dashboard/UserData";
import AutoMealPlan from "./pages/dashboard/AutoMealPlan";

// Premium/Dev Only
import PickMealPlan from "./pages/dashboard/PickMealPlan";
import RealTimePantry from "./pages/dashboard/RealTimePantry";
import MagicRecipe from "./pages/dashboard/MagicRecipe";

// Dev Only
import AllRecipes from "./pages/dashboard/AllRecipes";
import Analytics from "./pages/dashboard/Analytics";

const router = createBrowserRouter([
    {
        path:'/',
        element : <PublicLayout />,
        children : [
            {
                path: '',
                element : <Home />
            },
            {
                path: 'aboutus',
                element: <AboutUs />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element : <Register />
            }
        ]
    },
    {
        path: '/dashboard',
        element: <DashboardLayout />,
        children : [
            {
                path: "user",
                element: <UserData /> 
            },
            {
                path: "automealplan",
                element: <AutoMealPlan />
            },

            // Premium Features
            {
                path: "pickmealplan", element: <PickMealPlan />
            },
            {   
                path: "inventory", element: <RealTimePantry />
            },
            {    
                path: "magicdish", element: <MagicRecipe />
            },

            // Developer
            { 
                path: "allrecipes", element: <AllRecipes />
            },
            { 
                path: "analytics", element: <Analytics />
            }
        ]
    }     
]);

export default router;