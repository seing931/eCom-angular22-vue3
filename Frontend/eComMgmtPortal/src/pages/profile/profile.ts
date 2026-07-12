import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service'; // 👈 Inject your AuthService
import { environment } from '../../core/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  empId: number = 0;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isSaving = false;

  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.initForm();

    // 💡 Wait for localforage storage hydration to complete safely via your isReady promise
    this.authService.isReady.then(() => {
      const activeEmpId = this.authService.getEmpId();
      
      if (activeEmpId && activeEmpId > 0) {
        this.empId = activeEmpId;
        this.loadEmployee();
      } else {
        // If no valid employee session is found, redirect back to login
        this.router.navigate(['/login']);
      }
    });
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      empID: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: [null],
      dateofBirth: [''],
      gender: [''],
      email: ['', [Validators.required, Validators.email]], // Added required fallback matching UI
      address: [''],
      phone: [''],
      mobile: ['', Validators.required],
      photoPath: ['']
    });
  }

  loadEmployee(): void {
    this.profileService.getProfile(this.empId).subscribe({
      next: (res: any) => {
        if (!res) return;

        if (res.dateofBirth) {
          res.dateofBirth = res.dateofBirth.substring(0, 10);
        }

        this.profileForm.patchValue({
          empID: res.empID || this.empId,
          firstName: res.firstName,
          lastName: res.lastName,
          age: res.age,
          dateofBirth: res.dateofBirth,
          gender: res.gender,
          email: res.email,
          address: res.address,
          phone: res.phone,
          mobile: res.mobile,
          photoPath: res.photoPath
        });

        if (res.photoPath) {
          this.imagePreview = environment.serUrl + `${res.photoPath}`;
        }

      },
      error: err => {
        console.error('Failed to load profile entries:', err);
      }
    });
  }

onFileChange(event: any, type: number) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result; // This is a base64 string
    };
    reader.readAsDataURL(file);
  }
}

clearImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.profileForm.patchValue({ photoPath: '' });
  }

save(): void {
  if (this.profileForm.invalid || this.isSaving) {
    this.profileForm.markAllAsTouched();
    return;
  }

  this.isSaving = true;
  const formData = new FormData();

  Object.keys(this.profileForm.controls).forEach(key => {
    const value = this.profileForm.get(key)?.value;
    
    // 💡 FIX: Prevent sending empty string/null for numeric or date types
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value.toString());
    }
  });

  if (this.selectedFile) {
    formData.append('UpdFile', this.selectedFile, this.selectedFile.name);
  }

  this.profileService.edit(this.empId, formData).subscribe({
    next: () => {
      this.isSaving = false;
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully'
      }); 
    },
    error: err => {
      this.isSaving = false;
      
      // 💡 FIX: Extract the actual message from the error object
      console.error('Full server error details:', err); // Check your browser console log!
      
      const errorMsg = err.error?.title || err.message || 'Failed to update profile changes.';
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg
      });
    }
  });
}
}