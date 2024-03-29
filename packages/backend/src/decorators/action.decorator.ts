import { RequestHandler } from 'express';
import { sortBy } from 'lodash';

import { ParameterMetadata, ParameterMetadataKey, ParameterType } from './parameter.decorator';

export const ActionMetadata = Symbol('ActionMetadata');

export type ActionParameter = {
  path: string;
  method: 'get' | 'post' | 'patch' | 'delete';
};

const Deserialize = (type: ParameterType, value: any) => {
  switch (type) {
    case 'string':
      return value.toString();
    case 'number':
      return Number.parseFloat(value);
    case 'boolean':
      return value == 'true';
    case 'bigint':
      return BigInt(value);
    case 'object':
      return JSON.parse(value);
  }
};

export const Action: (params?: ActionParameter) => MethodDecorator = (params?: ActionParameter) => {
  return (target: any, propertyKey: string | Symbol, descriptor: PropertyDescriptor) => {
    target[ActionMetadata] = target[ActionMetadata] || new Map();
    target[ActionMetadata].set(propertyKey, params);

    const originalMethod = descriptor.value!;
    let parameters: ParameterMetadata[] = Reflect.getOwnMetadata(
      ParameterMetadataKey,
      target,
      propertyKey?.toString() ?? '',
    );
    if (!parameters || parameters.length <= 0) return;
    parameters = sortBy(parameters, (x) => x.parameterIndex);
    console.log('Setting up override method for parameters', parameters);
    const fn: RequestHandler = function (req, res, next) {
      const actionArguments = [];
      for (const { from, required, alias, type } of parameters) {
        switch (from) {
          case 'query':
            actionArguments.push(Deserialize(type, req.query[alias]));
            break;
          case 'header':
            actionArguments.push(Deserialize(type, req.header(alias)));
            break;
          case 'path':
            actionArguments.push(Deserialize(type, req.params[alias]));
            break;
          case 'payload':
            actionArguments.push(new Error('Not implemented yet!'));
            break;
        }
      }
      console.log('invoke action with params: ', actionArguments);
      return originalMethod.apply(this, actionArguments);
    };
    descriptor.value = fn;
  };
};
