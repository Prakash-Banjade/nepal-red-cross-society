import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsGreaterThanOrEqualToStartDateConstraint
    implements ValidatorConstraintInterface {
    validate(endDate: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const startDate = (args.object as any)[relatedPropertyName];
        return typeof endDate === 'string' && typeof startDate === 'string' && new Date(endDate) >= new Date(startDate);
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        return `endDate must be greater than or equal to ${relatedPropertyName}`;
    }
}

export function IsGreaterThanOrEqualToStartDate(
    property: string,
    validationOptions?: ValidationOptions,
) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: IsGreaterThanOrEqualToStartDateConstraint,
        });
    };
}
