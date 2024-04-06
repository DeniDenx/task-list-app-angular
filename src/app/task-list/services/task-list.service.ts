import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ITaskList } from '../models/task-list';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  constructor() { }

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getTaskList(): Observable<ITaskList[]> {
    return this.http.get<ITaskList[]>(`${this.apiUrl}tasks`);
  }

  updateTaskList(taskList: ITaskList[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}tasks`, taskList);
  }
}
