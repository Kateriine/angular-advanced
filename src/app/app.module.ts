import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeLogger } from 'ngrx-store-logger';
import { storeFreeze } from 'ngrx-store-freeze';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { first } from 'rxjs/operators';
import { interval, concat } from 'rxjs';

// Application Redux State
export interface AppState {
  // reducer interfaces
}

export function logger(reducer: ActionReducer<AppState>): any {
  // default, no options
  return storeLogger()(reducer);
}

export const metaReducers: MetaReducer<AppState>[] = [logger, storeFreeze]; // include only in development!

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HomeModule,
    HttpClientModule,
    StoreModule.forRoot(
      {}, // empty reducers at the root
      { metaReducers }
    ),
    StoreDevtoolsModule.instrument({
      maxAge: 50, // retains last 50 states
      name: 'AngularAdvancedApp - NGRX Store DevTools', // shown in the monitor page
      logOnly: false, // restrict extension to log-only mode (set to false only in development to enable all the extension features!)
    }),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  // Diagnostic only: inspect router configuration
  constructor(
    router: Router,
    private swUpdate: SwUpdate,
    public appRef: ApplicationRef
  ) {
    // Use a custom replacer to display function names in the route configs
    // const replacer = (key, value) => (typeof value === 'function') ? value.name : value;
    //
    // console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
    swUpdate.available.subscribe(event => {
      console.log('there is a new version');
      console.log('current version is ' + event.current);
      console.log('new version is ' + event.available);
      const update = window.confirm(
        "There's a new version of the app, do you want to update?"
      );
      if (update) {
        this.swUpdate.activateUpdate().then(() => document.location.reload());
      }
    });
    swUpdate.activated.subscribe(event => {
      console.log('there is a new version of the app (update)');
      console.log('previous version is ' + event.previous);
      console.log('current version is ' + event.current);
    });

    const appIsStable$ = appRef.isStable.pipe(
      first(isStable => isStable === true)
    );

    const interval$ = interval(1000 * 10);

    concat(appIsStable$, interval$).subscribe((value: any) => {
      this.swUpdate
        .checkForUpdate()
        .finally(() => console.log('check for update done'));
    });
  }
}
