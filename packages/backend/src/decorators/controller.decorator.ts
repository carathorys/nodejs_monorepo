import { ActionMetadata, ActionParameter } from './action.decorator';
import { Injectable } from '@furystack/inject';

import { DecoratorDataStore } from './decorator-store';

export type ControllerParameter = {
  basePath?: string;
};

export const ControllerMetadata = Symbol('ControllerMetadata');

export const Controller =
  (parameters?: ControllerParameter) =>
  <T extends { new (...args: any[]): {} }>(Base: T) => {
    @Injectable({ lifetime: 'scoped' })
    class ControllerClass extends Base {}

    DecoratorDataStore.addControllerMetadata(Base.name, { ...parameters }, ControllerClass, Base);
    const actions = Base.prototype[ActionMetadata] as Map<string, ActionParameter>;
    actions?.forEach((value, key) => {
      DecoratorDataStore.appendActionMetadata(Base.name, key, value);
    });
    console.log('Finished processing Controller data');
    return ControllerClass;
  };
