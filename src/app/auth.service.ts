import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Auth0Client, Auth0ClientOptions } from '@auth0/auth0-spa-js';
import authConfig from '../../src/assets/auth_config.json';
import { LogoutOptions } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth0Client: Auth0Client;
  
 
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userProfileSubject = new BehaviorSubject<any>(null);


  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor() {
    const options = {
      domain: authConfig.domain,
      clientId: authConfig.clientId,
      cacheLocation: 'localstorage',  
      redirectUri: `https://127.0.0.1:4200/tasklist` // Redirect to the tasks page after login with the updated URL
    } as Auth0ClientOptions;
    this.auth0Client = new Auth0Client(options);

    // Initialize the authentication check
    this.handleAuthentication();  
  }
  
  // Existing login method retained
  async login() {
    await this.auth0Client.loginWithPopup();
    // After login, check the authentication state and update BehaviorSubjects
    this.checkAuthState();
  }

  // Existing logout method retained
  async logout() {
    await this.auth0Client.logout({
      returnTo: `https://127.0.0.1:4200/home`
    } as LogoutOptions);
    // After logout, reset the BehaviorSubjects
    this.isAuthenticatedSubject.next(false);
    this.userProfileSubject.next(null);
  }

  // Existing isAuthenticated method retained
  async isAuthenticated(): Promise<boolean> {
    return this.auth0Client.isAuthenticated();
  }

  // New method to check authentication state and update BehaviorSubjects
  private async checkAuthState() {
    const isAuthenticated = await this.auth0Client.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);
    if (isAuthenticated) {
      const userProfile = await this.auth0Client.getUser();
      this.userProfileSubject.next(userProfile);
    }
  }

  // New method to handle the authentication state at service initialization
  private async handleAuthentication() {
    const isAuthenticated = await this.auth0Client.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);
    if (isAuthenticated) {
      const userProfile = await this.auth0Client.getUser();
      this.userProfileSubject.next(userProfile);
    }
  }

  // Method to get user
  public async getUser() {
    return this.auth0Client.getUser();
  }

  // Method to handle authentication callback
  public async handleAuthCallback() {
   
  }
}
