import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { FormGroup } from '@angular/forms';
import { TaskFormService } from '../task-form.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css'],
})
export class TaskEditComponent implements OnInit {
  taskForm!: FormGroup;
  isAuthenticated: boolean = false;

  constructor(
    private taskFormService: TaskFormService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    );

    this.taskForm = this.taskFormService.initTaskForm();
    this.route.params.subscribe((params) => {
      const taskId = params['id'];
      if (taskId) {
        this.taskService.getTaskById(taskId).subscribe(
          (task) => {
            this.taskForm = this.taskFormService.initTaskForm(task);
          },
          (error) => {
            console.error('Error fetching task:', error);
          }
        );
      }
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.taskService.updateTask(this.route.snapshot.params['id'], this.taskForm.value).subscribe(
        (data) => {
          console.log('Task updated successfully:', data);
          this.router.navigate(['/tasklist']);
        },
        (error) => {
          console.error('Error updating task:', error);
        }
      );
    }
  }

  cancelEdit() {
    this.router.navigate(['/tasklist']);
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);
    });
  }

  login(): void {
    this.authService.login();
  }
}
