import { Component, inject, OnInit } from '@angular/core'; // 💡 Add OnInit
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class LoginComponent implements OnInit { // 💡 Implement OnInit
  model = {
    username: '',
    password: '',
    rememberMe: false
  };

  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.getSavedCredentials().then(creds => {
      if (creds) {
        this.model.username = creds.username || '';
        this.model.password = creds.password || '';
        this.model.rememberMe = true;
      }
    });
  }

  onLogin() {
    this.authService.login(this.model).subscribe({
      next: (res: any) => {
        const sessionData = { 
          ...res, 
          rememberMe: this.model.rememberMe,
          username: this.model.username,
          password: this.model.password
        };

        this.authService.setSession(sessionData);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
         console.error('Full Error Object Context:', err);
         let message = 'Unknown error';
         if (typeof err?.error === 'string') { message = err.error;
         } else if (err?.error?.message) { message = err.error.message; }
         Swal.fire({ icon: 'error', title: 'Error', text: message });
      }
    });
  }
}