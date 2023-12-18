import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  taskForm!: FormGroup;
  isAuthenticated: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Check if the user is authenticated
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    );

    // Initialize the form and load task data
    this.initializeForm();
    this.loadTaskData();
  }

  // Initializes the reactive form with validation rules
  private initializeForm() {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  // Loads task data for editing
  private loadTaskData() {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.taskService.getTaskById(taskId).subscribe(
        (task) => {
          // Format the date to match the input field
          if (task.dueDate) {
            task.dueDate = new Date(task.dueDate).toISOString().split('T')[0];
          }
          this.taskForm.patchValue(task);
        },
        (error) => {
          console.error('Error fetching task:', error);
        }
      );
    } else {
      console.error('Task ID is undefined');
    }
  }

  // Handles form submission
  onSubmit() {
    if (this.taskForm.valid) {
      const taskId = this.route.snapshot.paramMap.get('id');
      if (taskId) {
        this.taskService.updateTask(taskId, this.taskForm.value).subscribe(
          () => {
            this.snackBar.open('Task updated successfully', 'OK', { duration: 3000 });
            this.router.navigate(['/tasklist']);
          },
          (error) => {
            // Show a user-friendly error message
            this.snackBar.open('Error updating task: ' + this.parseErrorMessage(error), 'OK', { duration: 3000 });
            console.error('Error updating task:', error);
          }
        );
      }
    }
  }

  // Helper method to parse and return a user-friendly error message
  private parseErrorMessage(error: any): string {
    return error.error.message || 'Unknown error occurred';
  }

  // Navigates back to the task list without saving changes
  cancelEdit() {
    this.router.navigate(['/tasklist']);
  }

  // Logout functionality
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);
    });
  }

  // Login functionality
  login() {
    this.authService.login();
  }
}
