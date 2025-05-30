import React from "react";
import { createBrowserRouter } from "react-router";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import RegularLayout from "./layouts/RegularLayout";
import PremiumLayout from "./layouts/PremiumLayout";
import DeveloperLayout from "./layouts/DeveloperLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"
import AboutUs from "./pages/AboutUs";
import AllRecipes from "./pages/AllRecipes";
import AutoMealPlan from "./pages/AutoMealPlan";
import PickMealPlan from "./pages/PickMealPlan";
import MagicRecipe from "./pages/MagicRecipe";
import RealTimePantry from "./pages/RealTimePantry";
import UserData from "./pages/UserData";

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
                Register: 'register',
                element : <Register />
            }
        ]
    },
    {
        path: '/regular',
        element: <RegularLayout />,
        children : [
            {
                path : 'user',
                element : <UserData />
            },
            {
                path : '/automealplan',
                element : <AutoMealPlan />
            },
        ]
    },
    {
        path: '/premium', 
        element: <PremiumLayout />,
        children : [
            {
                path: 'user',
                element : <UserData />
            },
            {
                path : 'automealplan',
                element: <AutoMealPlan />
            },
            {
                path: 'pickmealplan',
                element: <PickMealPlan />
            },
            {
                path: 'inventory',
                element: <RealTimePantry />
            },
            {
                path: 'magicdish',
                element : <MagicRecipe />
            }
        ]
    },
    {
        path: 'devs',
        element : <DeveloperLayout />
    }
])