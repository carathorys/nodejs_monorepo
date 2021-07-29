import { Injectable } from '@furystack/inject';

export type LogSeverity = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

@Injectable({
  lifetime: 'singleton',
})
export class LoggerService {
  public Log(severity: LogSeverity, template: string, ...params: any[]): void {
    let str = template;
    if (!!params) {
      let i = 0;
      let namedParameters = params.filter((x) => typeof x === 'object' && !!x.key && !!x.value);
      let otherParameters = params.filter((x) => typeof x !== 'object' || !x.key || !x.value);
      while (namedParameters.length > i) {
        str = str.replace(`{${namedParameters[i].key}}`, namedParameters[i++].value.toString());
      }
      i = 0;
      while (/\{([^\}]*)\}/i.test(str) && otherParameters.length > i) {
        str = str.replace(/\{([^\}]*)\}/i, otherParameters[i++].toString());
      }
    }
    console.log(`[${severity}] ${str}`);
  }

  public Debug(template: string, ...params: any[]): void {
    this.Log('DEBUG', template, ...params);
  }
  public Info(template: string, ...params: any[]): void {
    this.Log('INFO', template, ...params);
  }
  public Warning(template: string, ...params: any[]): void {
    this.Log('WARNING', template, ...params);
  }
  public Error(template: string, ...params: any[]): void {
    this.Log('ERROR', template, ...params);
  }
  public Critical(template: string, ...params: any[]): void {
    this.Log('CRITICAL', template, ...params);
  }
}