import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  filteredTasks: any[] = [];
  priorities: string[] = ['All', 'High', 'Medium', 'Low'];
  selectedPriority: string = 'All';
  isAuthenticated: boolean = false;
  userEmail: string | undefined;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTaskList();
    this.checkAuthentication();
  }

  private loadTaskList() {
    this.taskService.getTasks().subscribe(
      (data: any[]) => {
        this.tasks = data;
        this.applyFilter();
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  applyFilter() {
    if (this.selectedPriority === 'All') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task => task.priority === this.selectedPriority);
    }
  }

  onPriorityChange() {
    this.applyFilter();
  }
  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        this.snackBar.open('Task deleted successfully', 'OK', { duration: 3000 });
        this.tasks = this.tasks.filter(task => task._id !== taskId);
        this.applyFilter();
      },
      (error) => {
        this.snackBar.open('Error deleting task', 'OK', { duration: 3000 });
        console.error('Error deleting task:', error);
      }
    );
  }
  

  async login() {
    await this.authService.login();
    this.checkAuthentication();
  }

  async logout() {
    await this.authService.logout();
    this.isAuthenticated = false;
    this.userEmail = undefined;
    this.router.navigate(['/home']);
  }

  // Define the checkAuthentication method
  private checkAuthentication() {
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.authService.getUser().then(user => {
            this.userEmail = user?.email;
          });
        }
      }
    );
  }
}