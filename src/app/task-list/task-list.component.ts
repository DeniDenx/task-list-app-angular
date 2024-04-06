import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';
import { ITaskList } from './models/task-list';
import { TaskListService } from './services/task-list.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {

  private taskListService = inject(TaskListService);

  taskList!: ITaskList[];
  prevTaskValue!: string | null;
  prevListValue!: string | null;

  currentEditTaskListId!: number | null;
  currentEditTaskIdx!: number | null;

  currentEditListId!: number | null;

  @ViewChild('myInput') myInput!: ElementRef;

  ngOnInit(): void {
    this.getTaskList();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    let updateTask = this.updateTask(this.taskList);
    firstValueFrom(updateTask).then(() => {
      this.resetTaskValues();
    });
  }

  getTaskList() {
    this.taskListService.getTaskList().subscribe({
      next: (data) => {
        this.taskList = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addTask(id: number, idx: number) {
    // let listIndex = this.taskList.findIndex((list) => list.id === id);
    this.taskList[idx].list.push(''.trim());
    this.editTask(id, this.taskList[idx].list.length - 1);
  }

  editTask(id: number, idx: number) {
    let listIndex = this.taskList.findIndex((list) => list.id === id);

    if (this.currentEditTaskListId == id && this.currentEditTaskIdx == idx) {
      if (this.taskList[listIndex].list[idx].trim().length === 0) {
        return this.deleteTask(id, idx, true);
      }

      let task = this.updateTask(this.taskList);
      firstValueFrom(task).then(() => {
        this.resetTaskValues();
        return;
      });

    }

    this.prevTaskValue = this.taskList[listIndex].list[idx];

    this.currentEditTaskListId = id;
    this.currentEditTaskIdx = idx;
  }

  deleteTask(id: number, idx: number, discard: boolean = false) {
    let listIndex = this.taskList.findIndex((list) => list.id === id);

    if (discard) {

      if (this.prevTaskValue !== null) {
        if (this.prevTaskValue.trim().length == 0) {
          this.taskList[listIndex].list.splice(idx, 1);
          this.updateTask(this.taskList);
        } else {
          this.taskList[listIndex].list[idx] = this.prevTaskValue;
          this.resetTaskValues();
        }
      }
    } else {
      this.taskList[listIndex].list.splice(idx, 1);
      let task = this.updateTask(this.taskList);
      firstValueFrom(task).then(() => {
        this.resetTaskValues();
      });
    }
  }

  addList() {
    this.taskList.push(
      {
        id: new Date().getTime(),
        name: '',
        list: []
      },
    );

    this.updateTask(this.taskList).subscribe(() => {
      let id = this.taskList[this.taskList.length - 1].id;
      this.editList(id);
    });
  }

  updateTask(taskList: ITaskList[]) {
    return this.taskListService.updateTaskList(taskList);
  }

  editList(id: number) {
    // let listIndex = this.taskList.findIndex((list) => list.id === id);

    if (this.currentEditListId == id) {
      let list = this.updateTask(this.taskList);
      firstValueFrom(list).then(() => {
        this.resetListValues();
        return;
      });
    }

    this.currentEditListId = id;


    window.setTimeout(() => {
      this.myInput.nativeElement.focus();
    });
  }

  deleteList(id: number, idx: number, discard: boolean = false) {
    let listIndex = this.taskList.findIndex((list) => list.id === id);

    if (discard) {
      if (this.prevListValue !== null) {
        this.taskList[listIndex].name = this.prevListValue;
        this.resetListValues();
      }
    } else {
      this.taskList.splice(listIndex, 1);

      let list = this.updateTask(this.taskList);
      firstValueFrom(list).then(() => {
        this.resetListValues();
        return;
      });
    }
  }

  resetTaskValues() {
    if (this.currentEditTaskListId !== null && this.currentEditTaskIdx !== null) {
      this.currentEditTaskListId = null;
      this.currentEditTaskIdx = null;
    }

    this.prevTaskValue = null;
  }

  resetListValues() {
    if (this.currentEditListId !== null) {
      this.currentEditListId = null;
    }
  }
}
