import 'reflect-metadata';

export const ParameterMetadataKey = Symbol('ParameterMetadata');

export type ParameterType = 'string' | 'number' | 'bigint' | 'boolean' | 'object';

export interface ParameterArguments {
  from: 'header' | 'query' | 'path' | 'payload';
  alias: string;
  required?: boolean;
  type: ParameterType;
}

export type ParameterMetadata = ParameterArguments & {
  parameterIndex: number;
};

export const Parameter: (args: ParameterArguments) => ParameterDecorator = (
  args: ParameterArguments,
) => {
  console.log('args', args);

  return (target: any, propertyKey: string, parameterIndex: number) => {
    let params: ParameterMetadata[] =
      Reflect.getOwnMetadata(ParameterMetadataKey, target, propertyKey) || [];

    params.push({ ...args, parameterIndex: parameterIndex });

    Reflect.defineMetadata(ParameterMetadataKey, params, target, propertyKey);
  };
};