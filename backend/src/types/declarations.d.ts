declare module 'bcrypt' {
  export function hash(data: any, saltOrRounds: string | number): Promise<string>;
  export function compare(data: any, encrypted: string): Promise<boolean>;
  export function hashSync(data: any, saltOrRounds: string | number): string;
  export function compareSync(data: any, encrypted: string): boolean;
}

declare module 'passport-jwt' {
  export class Strategy {
    constructor(options: any, verify: any);
  }
  export const ExtractJwt: {
    fromAuthHeaderAsBearerToken(): any;
    fromUrlQueryParameter(paramName: string): any;
  };
}

declare module '@nestjs/mapped-types' {
  export function PartialType<T>(classRef: new (...args: any[]) => T): new (...args: any[]) => Partial<T>;
}
