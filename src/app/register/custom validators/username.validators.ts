import { ValidationErrors, AbstractControl } from '@angular/forms';


export class usernameValidators{
    static beginWithNumber(control : AbstractControl) : ValidationErrors | null{
        let ch = (control.value as string).charCodeAt(0);
        if (ch >= 48 && ch <=57)
            return {beginWithNumber : true};
        return null;
    }

    static containSymbols(control : AbstractControl) : ValidationErrors | null{
        var RegExpression = /^[a-zA-Z0-9_ ]*$/;
        let username = control.value as string;
        if(!RegExpression.test(username)){
            return {containSymbols : true};
        }
        return null;
    }
}