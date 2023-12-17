// home.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = false;
  userEmail: string | undefined;

  constructor(
    public authService: AuthService, 
    private router: Router, 
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.loadUserProfile();
      }
    });
  }

  private loadUserProfile(): void {
    this.authService.getUser().then(user => {
      this.userEmail = user?.email;
    });
  }

  login(): void {
    this.authService.login();
  }

  async navigateTo(path: string): Promise<void> {
    const isAuthenticated = await this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.router.navigate([path]);
    } else {
      this.snackBar.open('Please log in first', '', { duration: 3000 });
    }
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);
    });
  }
}
