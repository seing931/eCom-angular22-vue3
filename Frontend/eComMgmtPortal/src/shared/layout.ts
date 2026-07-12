import { Component, OnInit, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { LoginResp } from '../models/login';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule,RouterOutlet],
  templateUrl: './layout.html'
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  public router = inject(Router);

  navbarMenus = signal<any[]>([]);
  sidebarMenus = signal<any[]>([]);
  user = signal<LoginResp | null>(null);

  constructor() {
    // 💡 Listens reactively. As soon as localforage sets the user, load menu routes!
    effect(() => {
      const activeUser = this.authService.currentUser();
      if (activeUser) {
        this.user.set(activeUser);
        this.loadMenus();
      }
    });
  }

  ngOnInit(): void {
    // Fallback in case memory state exists early
    const fastUserProfile = this.authService.getUser();
    if (fastUserProfile) {
      this.user.set(fastUserProfile);
      this.loadMenus();
    }
  }

  private loadMenus(): void {
    // Prevent multiple requests if menus are already loaded
    if (this.navbarMenus().length > 0) return;

    this.authService.getMenu('navbar').subscribe({
      next: (res: any) => this.navbarMenus.set(res),
      error: (err) => console.error('Navbar menu error:', err)
    });

    this.authService.getMenu('sidebar').subscribe({
      next: (res: any) => this.sidebarMenus.set(res),
      error: (err) => console.error('Sidebar menu error:', err)
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}