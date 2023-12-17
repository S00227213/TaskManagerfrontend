// task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  isAuthenticated: boolean = false;
  userProfile: any = null;
  username: string | undefined;
  email: string | undefined;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.loadTaskList();
    this.isAuthenticated = await this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.userProfile = await this.authService.getUser();
      this.username = this.userProfile?.name;
      this.email = this.userProfile?.email;
    }
  }

  loadTaskList() {
    this.taskService.getTasks().subscribe(
      (data: any[]) => this.tasks = data,
      (error) => console.error('Error fetching tasks:', error)
    );
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        console.log('Task deleted successfully');
        this.loadTaskList();
      },
      (error) => console.error('Error deleting task:', error)
    );
  }

  async login() {
    await this.authService.login();
    this.isAuthenticated = await this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.userProfile = await this.authService.getUser();
      this.username = this.userProfile?.name;
      this.email = this.userProfile?.email;
    }
  }

  async logout() {
    await this.authService.logout();
    this.isAuthenticated = false;
    this.userProfile = null;
    this.username = undefined;
    this.email = undefined;
    this.router.navigate(['/home']);
  }
}
