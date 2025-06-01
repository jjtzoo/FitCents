import React from "react";
import { createBrowserRouter } from "react-router";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import RegularLayout from "./layouts/RegularLayout";
import PremiumLayout from "./layouts/PremiumLayout";
import DeveloperLayout from "./layouts/DeveloperLayout";

// Pages
import Home from "./pages/landing_page/Home";
import Login from "./pages/landing_page/Login";
import Register from "./pages/dashboard/Register"
import AboutUs from "./pages/landing_page/AboutUs";
import AllRecipes from "./pages/dashboard/AllRecipes";
import AutoMealPlan from "./pages/dashboard/AutoMealPlan";
import PickMealPlan from "./pages/dashboard/PickMealPlan";
import MagicRecipe from "./pages/dashboard/MagicRecipe";
import RealTimePantry from "./pages/dashboard/RealTimePantry";
import UserData from "./pages/dashboard/UserData";
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
                path : 'automealplan',
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
        element : <DeveloperLayout />,
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
            },
            {
                path: 'allrecipes',
                element : <AllRecipes />
            },
            {
                path: 'analytics',
                element : <Analytics />
            }
        ]
    },
]);

export default router;