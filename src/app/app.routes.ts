import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskDetailsComponent } from './tasks/task-details/task-details.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'tasklist', component: TaskListComponent, canActivate: [AuthGuard] }, // Protected by AuthGuard
  { path: 'task-edit/:id', component: TaskEditComponent, canActivate: [AuthGuard] }, // Protected by AuthGuard
  { path: 'create-task', component: TaskDetailsComponent, canActivate: [AuthGuard] }, // Protected by AuthGuard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
