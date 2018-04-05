import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { MatToolbarModule } from '@angular/material'

import { ServiceWorkerModule } from '@angular/service-worker'
import { AppComponent } from './app.component'

import { environment } from '../environments/environment'
import { SnakeComponent } from './snake/snake.component'

@NgModule({
  declarations: [
    AppComponent,
    SnakeComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
