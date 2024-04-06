import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'tasklist', pathMatch: 'full' },
    { path: 'tasklist', component: TaskListComponent, title: 'Task List' }

];
