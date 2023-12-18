
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
    // Subscribe to the isAuthenticated observable from the AuthService
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        // Load the user's profile when authenticated
        this.loadUserProfile();
      }
    });
  }

  // Function to load the user's profile
  private loadUserProfile(): void {
    this.authService.getUser().then(user => {
      this.userEmail = user?.email;
    });
  }

  // Function to initiate the login process
  login(): void {
    this.authService.login();
  }

  // Function to navigate to a specific route if authenticated
  async navigateTo(path: string): Promise<void> {
    const isAuthenticated = await this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.router.navigate([path]);
    } else {
      this.snackBar.open('Please log in first', '', { duration: 3000 });
    }
  }

  // Function to initiate the logout process
  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/home']);
    });
  }
}
