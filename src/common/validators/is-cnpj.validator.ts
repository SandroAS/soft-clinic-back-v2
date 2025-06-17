// src/common/validators/is-cnpj.validator.ts

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCnpjConstraint implements ValidatorConstraintInterface {
  validate(cnpj: string, args: ValidationArguments) {
    if (!cnpj) {
      return true;
    }

    const cleanedCnpj = String(cnpj).replace(/[^\d]/g, '');

    if (cleanedCnpj.length !== 14) {
      return false;
    }

    if (/^(\d)\1{13}$/.test(cleanedCnpj)) {
      return false;
    }

    // Calcula o primeiro dígito verificador
    let sum = 0;
    const cnpjNumbers = cleanedCnpj.split('').map(Number);
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    for (let i = 0; i < 12; i++) {
      sum += cnpjNumbers[i] * weights1[i];
    }

    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;

    if (cnpjNumbers[12] !== digit1) {
      return false;
    }

    // Calcula o segundo dígito verificador
    sum = 0;
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    for (let i = 0; i < 13; i++) {
      sum += cnpjNumbers[i] * weights2[i];
    }

    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;

    if (cnpjNumbers[13] !== digit2) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'CNPJ inválido.';
  }
}

// Decorador personalizado para usar @IsCnpj
export function IsCnpj(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCnpjConstraint,
    });
  };
}
