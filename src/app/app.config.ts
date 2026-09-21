import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';

import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { ptBR } from 'date-fns/locale';

import { pt_BR, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';

import { routes } from './app.routes';

import { authInterceptor } from '@core/interceptors/auth-interceptor';

registerLocaleData(pt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),

    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },

    provideNzI18n(pt_BR),

    provideNzDateFnsAdapter({
      locale: ptBR,
      firstDayOfWeek: 0
    })
  ]
};