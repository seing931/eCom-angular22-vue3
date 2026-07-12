import { HttpClient } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environment';
import { LoginReq, LoginResp } from '../../models/login';
import { CookieService } from 'ngx-cookie-service';
import * as localforage from 'localforage';
import { Observable } from 'rxjs';

const PROFILE_KEY = 'user_profile';
const REMEMBERED_CREDS_KEY = 'remembered_credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private platformId = inject(PLATFORM_ID);

  currentUser = signal<LoginResp | null>(null);
  private token: string | null = null; 

  public isReady: Promise<void>;
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.token = this.cookieService.get('auth_token') || null;
      
      this.isReady = localforage.getItem<LoginResp>(PROFILE_KEY)
        .then(profile => {
          if (profile) {
            this.currentUser.set(profile);
          }
        })
        .catch(err => {
          console.error('Error hydrating storage:', err);
        });
    } else {
      this.isReady = Promise.resolve();
    }
  }

  login(data: LoginReq): Observable<LoginResp> {
    return this.http.post<LoginResp>(`${environment.apiUrl}/auth/login`, data);
  }

  setSession(user: LoginResp): void {
    this.currentUser.set(user);
    this.token = user.token;
    
    if (isPlatformBrowser(this.platformId)) {
      const cookieExpiry = user.rememberMe ? 7 : undefined;
      this.cookieService.set('auth_token', user.token, { expires: cookieExpiry, secure: true, sameSite: 'Strict', path: '/' });
      
      localforage.setItem(PROFILE_KEY, user).catch(err => console.error(err));
      
      if (user.rememberMe) {
        localforage.setItem(REMEMBERED_CREDS_KEY, {
          username: user.username,
          password: user.password
        }).catch(err => console.error(err));
      } else {
        localforage.removeItem(REMEMBERED_CREDS_KEY).catch(err => console.error(err));
      }
    }
  }
  getSavedCredentials(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      return localforage.getItem(REMEMBERED_CREDS_KEY);
    }
    return Promise.resolve(null);
  }
  getUser(): LoginResp | null { return this.currentUser(); }
  getToken(): string | null {
    if (!this.token && isPlatformBrowser(this.platformId)) {
      this.token = this.cookieService.get('auth_token');
    }
    return this.token;
  }
  getEmpId(): number | null { return this.currentUser() ? this.currentUser()!.id : null; }
  getRememberMe(): boolean { return this.currentUser() ? this.currentUser()!.rememberMe : false; }
  isLoggedIn(): boolean { return !!this.getToken(); }
  logout(): void {
    this.currentUser.set(null);
    this.token = null;
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.delete('auth_token', '/');
      localforage.removeItem(PROFILE_KEY);
    }
  }
  getMenu(category: string) {
    return this.http.get(`${environment.apiUrl}/auth/menu?cat=${category}`);
  }
}