import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // 💡 Swapped to ReactiveFormsModule
  templateUrl: './employee-add.html'
})
export class EmpAddComponent implements OnInit {
  empForm!: FormGroup; // 💡 Converted from model object to typed FormGroup
  isSaving = false;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private empService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // 💡 Define explicit Reactive controls with validators matching the Product schema setup
  initForm(): void {
    this.empForm = this.fb.group({
      firstName: ['', [Validators.required]], // Added required validation check
      lastName: [''],
      age: [null],
      gender: [''],
      dateofBirth: [null],
      email: [''],
      phone: [''],
      mobile: ['', [Validators.required]], // Added required validation check
      address: [''], 
      photoPath: ['']
    });
  }

  // ==========================================
  // ADD Employee (Smart JSON / Form Data Router)
  // ==========================================
// 💡 Accept the Event parameter
addEmp(event: Event): void {
  event.preventDefault(); // 🔥 Crucial: Stops the browser from hard-refreshing the page

  if (this.empForm.invalid || this.isSaving) {
    this.empForm.markAllAsTouched(); 
    return;
  }

  this.isSaving = true;
  const formData = new FormData();
  
  Object.keys(this.empForm.controls).forEach(key => {
    const value = this.empForm.get(key)?.value;
    
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value.toString());
    } else {
      formData.append(key, '');
    }
  });

  if (this.selectedFile) {
    formData.append('UpdFile', this.selectedFile, this.selectedFile.name);
  }

  this.empService.create(formData).subscribe({
    next: () => {
      this.isSaving = false;
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Employee created successfully.'
       }).then(() => {
          this.router.navigate(['/employee']);
        });
    },
    error: (err) => {
      this.isSaving = false;
      console.error('Full Error Object Context:', err);
      let message = 'Unknown error';
        if (typeof err?.error === 'string') {message = err.error;
        } else if (err?.error?.message) {message = err.error.message;}
        Swal.fire({ icon: 'error', title: 'Error', text: message });
    }
  });
}

  onFileSelected(event: any): void {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    this.selectedFile = file;
    this.empForm.patchValue({ photoPath: file.name });
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.empForm.patchValue({ photoPath: '' });
  }
}