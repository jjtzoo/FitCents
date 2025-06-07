
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

export const targetBMI = (userBMI, userAge) => {
    if (userAge < 18) {
        return "BMI calculations will not be accurate"
    }

    if (userBMI > 24.9) {
        return 24.9;
    } else if (userBMI >= 18.5 && userBMI <=24.9) {
        return userBMI
    } else {
        return 18.5
    }
}

export const targetWeight = (targetBMI, userHeight) => {
    return targetBMI * squared(userHeight/100);
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