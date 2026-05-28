export const suma = (...numbers) => {
    if(numbers.length < 2){
        return "error parameter"
    }
    if(!numbers.every(number => typeof(number) === "number")){
        return "error"
    }
    return numbers.reduce((acc,number)=> acc + number,0)
}
