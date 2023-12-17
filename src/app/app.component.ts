import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  title = 'frontend'; // Define the title property here
  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.isAuthenticated = await this.authService.isAuthenticated();
    if (window.location.search.includes('code=')) {
      await this.authService.handleAuthCallback();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
