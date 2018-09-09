import { ValidationErrors, AbstractControl } from '@angular/forms';

export class commonValidators{
    // this function is to check if there're spaces into username
    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
        if ((control.value as string).indexOf(' ') >= 0)
            return {cannotContainSpace : true};
        return null;
    }
}