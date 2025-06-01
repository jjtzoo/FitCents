export const heightConverter = (height) => {
    const heighInInches = height.trim();

    const splitHeight = heighInInches.split(`'`);
    if (splitHeight.length !== 2) return null;

    const feet = parseInt(splitHeight[0])
    const inches = parseInt(splitHeight[1].slice(0,splitHeight[1].length -1))

    if (
        isNaN(feet) || isNaN(inches) ||
        feet < 4 || feet > 7 ||
        inches < 0 || inches > 11 
    ) {
        return null
    }

    const feetToInches = feet * 12 + inches
    const cm = feetToInches * 2.54
    return Math.round(cm);
}