import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { TaskService } from '../../task.service';
import { TaskFormService } from '../../task-form.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent implements OnInit {
  taskForm!: FormGroup; // Definite assignment assertion
  today: Date = new Date(); // Added to handle the minimum date in the form
  errorMessage: string = '';

  constructor(
    private taskFormService: TaskFormService, 
    private taskService: TaskService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.taskForm = this.taskFormService.initTaskForm();
  }

  createTask() {
    if (this.taskForm.valid) {
      this.taskService.createTask(this.taskForm.value).subscribe(
        (data: any) => {
          console.log('New task created successfully:', data);
          this.router.navigate(['/tasks']); // Navigate back to the task list upon success
        },
        (error: any) => {
          console.error('Error creating task:', error);
          this.errorMessage = `Error creating task: ${error.status} ${error.statusText}`;
          if (error.error && error.error.message) {
            this.errorMessage += ` - ${error.error.message}`;
          }
        }
      );
    }
  }
}
