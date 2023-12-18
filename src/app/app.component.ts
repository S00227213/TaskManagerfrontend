import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { SecureDataService } from './secure-data.service';
import { AuthModule } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  authenticatedData: any; 
  jwtToken: string = ''; 
  title = 'frontend'; 

  constructor(
    private authService: AuthService,
    private secureDataService: SecureDataService
  ) {}

  async ngOnInit() {
    this.isAuthenticated = await this.authService.isAuthenticated();
    if (window.location.search.includes('code=')) {
      await this.authService.handleAuthCallback();
    }
  }

  logout(): void {
    this.authService.logout();
  }
  fetchData(): void {
    if (!this.jwtToken) {
      console.error('JWT token not available. Please log in first.');
      return;
    }

    this.secureDataService.getSecureData(this.jwtToken).subscribe(
      (response) => {
        this.authenticatedData = response;
        console.log('Authenticated Data:', this.authenticatedData);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
