import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routes';
import { MaterialModule } from './material.module';
import { AuthModule } from '@auth0/auth0-angular';
import { AppComponent } from './app.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskDetailsComponent } from './tasks/task-details/task-details.component';
import { HomeComponent } from './home/home.component';

const authConfig = require('../assets/auth_config.json');

@NgModule({
  declarations: [
    AppComponent, 
    TaskListComponent, 
    TaskEditComponent,
    TaskDetailsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    AuthModule.forRoot({
      domain: authConfig.domain,
      clientId: authConfig.clientId
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
