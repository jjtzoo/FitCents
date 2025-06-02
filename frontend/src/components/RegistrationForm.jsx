import React from 'react'
import { useState, useEffect } from 'react'
import { createItem } from '../api/crud'
import { heightConverter } from '../utils/heightConverter'
import { restrictionOptions } from './RegistrationForm/restrictionOptions'

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
        } else {
            setRestrictions((currentRestrictions) => {
                return checked 
                    ? [...currentRestrictions, value] 
                    : currentRestrictions.filter((uncheckedItem) => uncheckedItem !== value);
            });
        }
    };

    return (
        
        <>
            <form>
                <fieldset>
                    <legend> Registration Form </legend>
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
                        <label htmlFor='email'>
                        Email
                        </label>
                        <input 
                            type='email'
                            name='email'
                            placeholder='Enter your email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                    value="unspecified" 
                                    name='gender'
                                    checked = {gender === 'unspecified'}
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
                            <option value="sedentary"> little/no exercise </option>
                            <option value="lightly_active"> 1-3 days/week</option>
                            <option value="moderately_active">3-5 days/week</option>
                            <option value="very_active">6-7 days/week</option>
                            <option value="extra_active">Extra Active - physical job + exercise</option>
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
                            <option value="high">High Weight Loss</option>
                            <option value="moderate">Moderate Weight Loss</option>
                        </select>
                    </div>

                    <fieldset>
                        <legend>Dietary Restrictions</legend>
                        {restrictionOptions.map((restriction) => (
                            <label key={restriction}>
                                <input 
                                    type="checkbox" 
                                    name="restrictions"
                                    checked={restrictions.includes(restriction)}
                                    onChange={handleRestrictions}
                                />
                                {restriction.replace(/_/g, ' ')}
                            </label>
                        ))}
                    </fieldset>
                </fieldset>
            </form>
        </>
  )
}

export default RegistrationForm
