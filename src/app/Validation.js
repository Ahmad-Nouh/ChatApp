const passwordCriterias=['Password must contain at least 8 charachters',
                         'Password must contain at least 1 uppercase letter',
                         'Password must contain at least 1 lowercase letter',
                         'Password must contain at least 1 number'];

function isNumber(input) {
    var inputAsInt = parseInt(input);
    return inputAsInt != null && !isNaN(inputAsInt);
}
function isLetter(input) {
    input = input.toString();
    if (input.length != 1)
        return false;
    return (input >= 'A' && input <= 'Z') || (input >= 'a' && input <= 'z');
}
function isUpper(input){
    input = input.toString();
    if (input.length != 1 || !isLetter(input))
        return false;
    return (input >= 'A' && input <= 'Z');
}
function isLower(input){
    input = input.toString();
    if (input.length != 1 || !isLetter(input))
        return false;
    return (input >= 'a' && input <= 'z');
}

/**
 * 
 * @return {verdict: boolean, description: string}  
 */
function validateName(name) {
    if (name == null)
        return { verdict: false, description: "Name property cannot be null" };
    name = name.toString();
    if (name.length == 0)
        return { verdict: false, description: "Name property cannot be empty" };
    for (let idx = 0; idx < name.length; idx++)
        if (!isLetter(name[idx]))
            return { verdict: false, description: "Name property must consist of English letters only" };
    return { verdict: true, description: '' };
}
/**
 * 
 * @return {verdict: boolean, description: string}
 */
function validatePassword(password) {
    let criterias=[0,0,0,0];
    let length=password.length;
    criterias[0]=length>=8;
    for(let i=0;i<length;i++){
        let charachter=password.charAt(i);
        criterias[1]|=isUpper(charachter);
        criterias[2]|=isLower(charachter);
        criterias[3]|=isNumber(charachter);
    }
    for(let i=0;i<4;i++)
        if(!criterias[i])
            return {verdict: false, description: passwordCriterias[i]};
    return {verdict: true, description:''};
}
/**
 * 
 * @return {verdict: boolean, description: string} username 
 */
function validateUsername(username) {
    for (let idx = 0; idx < username.length; idx++)
        if (!isLetter(username[idx]) && !isNumber(username[idx]) && username[idx] != '_')
            return { verdict: false, description: "Username can contain letters, numbers, or underscores" };
    return { verdict: true, description: "" };
}
module.exports = {
    validateName, validatePassword, validateUsername
};
