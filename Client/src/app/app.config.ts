import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import * as ApiVerbs from "./api/verbs";
import {provideHttpClient} from "@angular/common/http";
import {provideStore, StoreModule} from '@ngrx/store';
import {appReducers} from "./state/app.state";
import { provideEffects } from '@ngrx/effects';
import {AppStateEffects} from "./state/app.state.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(ApiVerbs.ApiModule.forRoot(() => new ApiVerbs.Configuration({ basePath: '' }))),
    provideHttpClient(),
    provideStore({ app: appReducers }),
    provideEffects(AppStateEffects)
]
};
