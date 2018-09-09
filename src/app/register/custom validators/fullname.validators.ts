import { ValidationErrors, AbstractControl } from '@angular/forms';

export class fullnameValidators {
    static containNumbersOrSymbols(control : AbstractControl) : ValidationErrors | null {
        var RegExpression = /^[a-zA-Z\s]*$/;  
        let fullname = control.value as string;
        if (!RegExpression.test(fullname))
            return {containNumbersOrSymbols : true}
        return null;
    }
} 