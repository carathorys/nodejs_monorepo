import 'reflect-metadata';

import { Injector } from '@furystack/inject';

import express, { RequestHandler } from 'express';

import { LoggerService } from './services';

console.log('-===============================================-');
const app = express();

var services = new Injector();

app.use(async (req, res, next) => {
  let requestScope = services.createChild({
    owner: req,
    parent: services,
  });
  const log = requestScope.getInstance(LoggerService);
  log.Info('New incoming request');

  (req as any).scope = requestScope;

  requestScope.setExplicitInstance(req);
  requestScope.setExplicitInstance(res);
  await next();
  await requestScope.dispose();
});

app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
});
