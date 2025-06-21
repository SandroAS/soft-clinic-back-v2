import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * Decorator para verificar se duas propriedades de um objeto são iguais.
 * Ideal para validação de senha e confirmação de senha.
 *
 * Exemplo de uso:
 * @MatchPassword('password', { message: 'As senhas não coincidem.' })
 * confirmPassword: string;
 */
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
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `A ${args.property} (${args.value}) deve ser igual a ${relatedPropertyName} (${(args.object as any)[relatedPropertyName]}).`;
        },
      },
    });
  };
}
