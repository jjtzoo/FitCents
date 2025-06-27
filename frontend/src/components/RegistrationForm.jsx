import React from 'react'
import { useState, useEffect } from 'react'
import { createItem } from '../api/crud'
import { heightConverter } from '../utils/heightConverter'
import { restrictionOptions } from './RegistrationForm/restrictionOptions'
import { conflictMap } from './RegistrationForm/conflictMap'
import { preferenceOption } from './RegistrationForm/preferenceOptions'
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion'
import axios from 'axios'

const apiURL = import.meta.env.VITE_API_BASE_URL;

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [gender, setGender] = useState("");
    const [name , setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [weight, setWeight] = useState("");
    const [activityLevel, setActivityLevel] = useState("");
    const [height, setHeight] = useState("");
    const [rawHeight, setRawHeight] = useState('');
    const [weightGoal, setWeightGoal] = useState('');
    const [error, setError] = useState(null);
    const [restrictions, setRestrictions] = useState([]);
    const [disabledRestrictions, setDisabledRestrictions] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [budget, setBudget] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleHeight = (e) => {
        const input = e.target.value;
        setRawHeight(input);

        const convertedHeight = heightConverter(input);

        if (convertedHeight === null) {
            setError(`Please enter height in format like 5'7" between 4'0" and 7'11". No spaces in between!`)
        } else {
            setError('');
            setHeight(convertedHeight);
        }
    }

    const handleRestrictions = (e) => {
        let {value, checked} = e.target;

        if (value === 'none') {
            setRestrictions([]);
            setDisabledRestrictions([]);
            return 
        } 

        setRestrictions((currentRestrictions) => {
                let newRestrictions;

                if (checked) {
                    newRestrictions = [...currentRestrictions, value]

                    if (conflictMap[value]) {
                        const conflictsToAdd = conflictMap[value];
                        newRestrictions = Array.from(new Set([...newRestrictions, ...conflictsToAdd]));
                    setDisabledRestrictions((restrictionDisabled) => {
                        return Array.from(new Set([...restrictionDisabled, ...conflictsToAdd]))
                    })
                    }
                } else {
                    newRestrictions = currentRestrictions.filter((r) => r !== value);

                    if (conflictMap[value]) { const conflictsToRemove = conflictMap[value];
                        setDisabledRestrictions((restrictionDisabled) => 
                         restrictionDisabled.filter((item) => !conflictsToRemove.includes(item))
                        );

                        newRestrictions = newRestrictions.filter((r) => 
                            !conflictsToRemove.includes(r) ||
                            currentRestrictions.some((other) =>
                                other !== value && (conflictMap[other] || []).includes(r)
                        )
                        
                    );

                    setDisabledRestrictions((restrictionDisabled) => {
                        return restrictionDisabled.filter((item) => 
                            !conflictsToRemove.includes(item) ||
                            currentRestrictions.some((other) => 
                                other !== value && (conflictMap[other] || []).includes(item)
                            )
                        );
                    });
                        
                }
            }
            return newRestrictions    
        });
        
    };

    const handlePreferences = (e) => {
        const { value, checked } = e.target;
        setPreferences((preference) => 
            checked
                ? [...preference, value]
                : preference.filter((preferenceNot) => preferenceNot !== value)
        );
    };

    const handleRegister = async (e) => {
        e.preventDefault(); 

        if (!username || !email || !password) {
        alert("All fields are required.");
        return;
        }

        try {
        const response = await axios.post(`${apiURL}/api/users/register`, userForms);

        console.log("✅ Registered:", response.data);
        alert("Registration successful!");
        navigate("/login")
        } catch (err) {
        console.error("❌ Registration failed:", err.response?.data || err.message);
        const message = err.response?.data?.error?.message || "Something went wrong.";
        alert(`Registration failed: ${message}`);
        }
    };


    const userForms = {
        auth: {
            username,
            email,
            password
        },
        biometrics : {
            name,
            age,
            gender,
            height_cm: height,
            weight_kg: weight,
            activityLevel,
            weightGoal
        },
        restrictions,
        preferences,
        budget_php: Number(budget)
    }

    console.log(userForms);
    return (
        
        
        <motion.form 
            onSubmit={handleRegister} 
            className='registration-form'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <fieldset className='registration-fieldset'>
                <legend className='registration-legend'> Registration Form </legend>
                <section className='user-auth-section'>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id='username'
                            value={username}
                            onChange = {(e)=> setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor='userEmail'>
                        Email
                        </label>
                        <input 
                            type='email'
                            id='userEmail'
                            placeholder='Enter your email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            onChange = {(e) => setPassword(e.target.value)} 
                        />
                    </div>
                </section>

                
                <section className='user-biometrics-section'>
                    <div>
                        <label htmlFor='name'>
                        Name
                        </label>
                        <input 
                            type='text'
                            id='name'
                            placeholder='Enter Your Name.'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor='age'>
                        Age
                        </label>
                        <input 
                            type='number'
                            id='age'
                            placeholder='Enter Your Age.'
                            value = {age}
                            onChange={(e) => setAge(Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label htmlFor="weight">Weight </label>
                        <input 
                        type="number" 
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        id='weight'
                        />
                    </div>

                    <div>
                        <label htmlFor="height">Height </label>
                        <input 
                        type="text"
                        value={rawHeight}
                        onChange={handleHeight} 
                        id='height'
                        />
                        {error && (
                            <p>
                                {error}
                            </p>
                        )}

                        <p>Converted to {height} cm</p>
                    </div>

                    

                    <div>
                        <label htmlFor="activity-level"> Activity Level:</label>
                        <select 
                        id="activity-level" 
                        value={activityLevel} 
                        onChange={(e) => setActivityLevel(e.target.value)}
                        >
                            <option value="">-- Select activity level --</option>
                            <option value="sedentary"> Sedentary, little/no exercise </option>
                            <option value="light"> Light, 1-3 days/week</option>
                            <option value="moderate"> Moderate, 3-5 days/week</option>
                            <option value="active">Active, 6-7 days/week</option>
                            <option value="veryActive">Very Active - physical job + exercise</option>
                        </select>
                    </div>
                </section>

                <fieldset className="registration-fieldset">
                    <legend className="registration-legend">Gender</legend>
                    <div className="gender-radio-group">
                        <label htmlFor="male" className="gender-radio-label">
                        <input
                            type="radio"
                            id="male"
                            value="male"
                            name="gender"
                            checked={gender === 'male'}
                            onChange={(e) => setGender(e.target.value)}
                            className="gender-radio-input"
                        />
                        Male
                        </label>

                        <label htmlFor="female" className="gender-radio-label">
                        <input
                            type="radio"
                            id="female"
                            value="female"
                            name="gender"
                            checked={gender === 'female'}
                            onChange={(e) => setGender(e.target.value)}
                            className="gender-radio-input"
                        />
                        Female
                        </label>

                        <label htmlFor="non-binary" className="gender-radio-label">
                        <input
                            type="radio"
                            id="non-binary"
                            value="non-binary"
                            name="gender"
                            checked={gender === 'non-binary'}
                            onChange={(e) => setGender(e.target.value)}
                            className="gender-radio-input"
                        />
                        Prefer not to say
                        </label>
                    </div>
                </fieldset>
                <div className="space-y-2">
                    <label htmlFor="weightGoal" className="block text-sm font-medium text-gray-700">
                        Select Your Weight Loss Goal
                    </label>
                    <select
                        id="weightGoal"
                        value={weightGoal}
                        onChange={(e) => setWeightGoal(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                    >
                        <option value="">-- Select a Goal --</option>
                        <option value="extreme">Extreme Weight Loss</option>
                        <option value="moderate">High Weight Loss</option>
                        <option value="light">Light Weight Loss</option>
                    </select>
                </div>

                <fieldset className="border border-amber-200 rounded-xl p-4 space-y-4">
                    <legend className="text-lg font-semibold text-amber-700 px-2">Dietary Restrictions</legend>

                    <div className="flex items-center space-x-2">
                        <input
                        type="checkbox"
                        value="none"
                        checked={restrictions.length === 0}
                        onChange={handleRestrictions}
                        id="no-restrictions"
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                        />
                        <label htmlFor="no-restrictions" className="text-sm font-medium text-gray-700">
                        No Restrictions
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {restrictionOptions.map((restriction) => (
                        <div key={restriction} className="flex items-center space-x-2">
                            <input
                            type="checkbox"
                            name="restrictions"
                            value={restriction}
                            checked={restrictions.includes(restriction)}
                            disabled={disabledRestrictions.includes(restriction) && !restrictions.includes(restriction)}
                            onChange={handleRestrictions}
                            id={restriction}
                            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 disabled:opacity-40"
                            />
                            <label htmlFor={restriction} className="text-sm font-medium text-gray-700 capitalize">
                            {restriction.replace(/_/g, ' ')}
                            </label>
                        </div>
                        ))}
                    </div>
                    </fieldset>
                <fieldset className="border border-teal-200 rounded-xl p-4 space-y-4">
                    <legend className="text-lg font-semibold text-teal-700 px-2">Cuisine Preferences</legend>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {preferenceOption.map((cuisine) => (
                        <div key={cuisine} className="flex items-center space-x-2">
                            <input
                            type="checkbox"
                            name="preferences"
                            id={cuisine}
                            value={cuisine}
                            checked={preferences.includes(cuisine)}
                            onChange={handlePreferences}
                            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                            />
                            <label htmlFor={cuisine} className="text-sm font-medium text-gray-700">
                            {cuisine}
                            </label>
                        </div>
                        ))}
                    </div>
                </fieldset>

                <div className="space-y-1">
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                        Budget Per Week (₱)
                    </label>
                    <input
                        type="number"
                        id="budget"
                        value={budget === null ? "" : budget}
                        onChange={(e) => {
                        const val = e.target.value;
                        setBudget(val === "" ? null : Number(val));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter amount in Philippine Peso"
                        min="0"
                    />
                </div>
            </fieldset>

            <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-md shadow-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
                {loading ? "Registering..." : "Register"}
            </button>
        </motion.form>
        
    )
}

export default RegistrationForm
