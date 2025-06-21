import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function MatchPassword(property: string, validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'MatchPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if ((value === undefined || value === null || value === '') &&
              (relatedValue === undefined || relatedValue === null || relatedValue === '')) {
            return true;
          }

          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `A confirmação de senha (${args.property}) não corresponde à senha (${relatedPropertyName}).`;
        },
      },
    });
  };
}