import React from 'react'
import { useState, useEffect } from 'react'
import { createItem } from '../api/crud'
import { heightConverter } from '../utils/heightConverter'
import { restrictionOptions } from './RegistrationForm/restrictionOptions'
import { conflictMap } from './RegistrationForm/conflictMap'
import { preferenceOption } from './RegistrationForm/preferenceOptions'

const RegistrationForm = () => {
    const [gender, setGender] = useState("");
    const [name , setName] = useState("");
    const [age, setAge] = useState(0);
    const [email, setEmail] = useState("");
    const [weight, setWeight] = useState(0);
    const [activityLevel, setActivityLevel] = useState("");
    const [height, setHeight] = useState(0);
    const [rawHeight, setRawHeight] = useState('');
    const [weightGoal, setWeightGoal] = useState('');
    const [error, setError] = useState(null);
    const [restrictions, setRestrictions] = useState([]);
    const [disabledRestrictions, setDisabledRestrictions] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [budget, setBudget] = useState([]);

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
    }


    const userForms = {
        name : name,
        age: age,
        gender: gender,
        weight: weight,
        activityLevel: activityLevel,
        weightGoal: weightGoal,
        restrictions: restrictions,
        preferences: preferences
    }

    console.log(userForms);
    return (
        
        <>
            <form>
                <fieldset>
                    <legend> Registration Form </legend>
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

                    <fieldset>
                        <legend>
                            <div>
                                <label>
                                    <input 
                                    type='radio'
                                    value='male'
                                    name='gender'
                                    checked={gender === 'male'}
                                    onChange={(e) => setGender(e.target.value)} 
                                    />
                                    Male
                                </label>
                                <label>
                                    <input 
                                    type="radio"
                                    value="female"
                                    name='gender'
                                    checked={gender === 'female'}
                                    onChange={(e) => setGender(e.target.value)} 
                                    />
                                    Female
                                </label>
                                <label>
                                    <input 
                                    type="radio"
                                    value="non-binary" 
                                    name='gender'
                                    checked = {gender === 'non-binary'}
                                    onChange={(e) => setGender(e.target.value)}
                                    />
                                Prefer not to say
                                </label>
                            </div>
                        </legend>
                    </fieldset>

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
                            <option value="sedentary"> Sedentary, little/no exercise </option>
                            <option value="light"> Light, 1-3 days/week</option>
                            <option value="moderate"> Moderate, 3-5 days/week</option>
                            <option value="active">Active, 6-7 days/week</option>
                            <option value="veryActive">Very Active - physical job + exercise</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="weightGoal">Select Your Weight Loss Goal</label>
                        <select
                            id="weightGoal"
                            value={weightGoal}
                            onChange={(e) => setWeightGoal(e.target.value)}
                        >
                            <option value="">-- Select a Goal --</option>
                            <option value="extreme">Extreme Weight Loss</option>
                            <option value="moderate">High Weight Loss</option>
                            <option value="light">Light Weight Loss</option>
                        </select>
                    </div>

                    <fieldset>
                        <legend>Dietary Restrictions</legend>
                        <label>
                            <input 
                                type="checkbox"
                                value="none"
                                checked={restrictions.length === 0}
                                onChange={handleRestrictions} 
                            />
                            NoRestrictions
                        </label>
                        {restrictionOptions.map((restriction) => (
                            <label key={restriction}>
                                <input 
                                    type="checkbox" 
                                    name="restrictions"
                                    value={restriction}
                                    checked={restrictions.includes(restriction)}
                                    disabled={disabledRestrictions.includes(restriction) && !restrictions.includes(restriction)}
                                    onChange={handleRestrictions}
                                />
                                {restriction.replace(/_/g, ' ')}
                            </label>
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>Cuisine Preferences</legend>
                        {preferenceOption.map((cuisine) => (
                            <label key={cuisine} htmlFor={cuisine}>
                                <input 
                                    type="checkbox"
                                    name="preferences"
                                    id={cuisine}
                                    value={cuisine}
                                    checked={preferences.includes(cuisine)}
                                    onChange={handlePreferences}
                                />
                                {cuisine}
                            </label>
                        ))}
                    </fieldset>

                    <div>
                        <label htmlFor="budget">
                            <input 
                                type="number"
                                id='budget'
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))} 
                            />
                        </label>
                    </div>
                </fieldset>
            </form>
        </>
  )
}

export default RegistrationForm
