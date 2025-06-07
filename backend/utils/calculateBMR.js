
// Mifflin-St Jeor Equation
export const calculateUserBMR = (weight_kg, height_cm, age, gender ) => {
    if (gender === "male") {
        const bmrMale = ((10 * weight_kg) + (6.25*height_cm) - (5*age) + 5 );
        return bmrMale;
    } else {
        const bmrFemale = ((10 * weight_kg ) + (6.25*height_cm) - (5*age) - 161 );
        return bmrFemale;
    }
}

export const calculateUserBMI = (weight_kg, height_cm) => {
    const height_m = height_cm/100;
    return weight_kg / squared(height_m);
}

export const calculateCurrentTDEE = ( userBMR, activity_level) => {
    const activityMultipliers = {
        sedentary : 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        extra_active: 1.9
    }

    return userBMR * (activityMultipliers[activity_level] || 1)
}

export const targetTDEE = (currentTDEE, gender, weightgoal) => {
    const minTDEE = gender === "male" ? 1500 : 1200;

    const reductionMap = {
        extreme : 1000,
        moderate: 500,
        light: 250
    };

    const reduction = reductionMap[weightgoal] || 0;
    const target = currentTDEE - reduction;

    return target < minTDEE ? minTDEE : target;
}

function squared(number) {
    return number * number
}