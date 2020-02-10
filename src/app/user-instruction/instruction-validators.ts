import { Validators } from '@angular/forms';

export class InstructionValidators {
    static botCommandsValidators = [
        Validators.required,
        Validators.pattern(/^((\d{0,4})|(10000))$/)
    ];

    static startingCoordinatesValidators = [
        Validators.required,
        Validators.pattern(`[-+]?(\\d{1,5}|(100000))\\s[-+]?(\\d{1,5}|(100000))`)
    ];

    static directionValidators = [
        Validators.required,
        Validators.pattern(`[EWNS]\\s(\\d{1,5}|(100000))`)
    ];
}
