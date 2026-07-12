import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideCharts(withDefaultRegisterables())
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
