import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CustomerService } from '../../core/services/customer.service';

@Component({
  selector: 'app-customer-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // 💡 Swapped to ReactiveFormsModule
  templateUrl: './customer-add.html'
})
export class CustomerAddComponent implements OnInit {
  custForm!: FormGroup; // 💡 Converted from model object to typed FormGroup
  isSaving = false;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // 💡 Define explicit Reactive controls with validators matching the Product schema setup
  initForm(): void {
    this.custForm = this.fb.group({
      firstName: ['', [Validators.required]], // Added required validation check
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      age: [null],
      gender: [''],
      dateofBirth: [null],
      organization: [''],
      country: [''],
      state: [''],
      city: [''],
      postalCode: [''],
      email: [''],
      altEmail: [''],
      phone1: [''],
      phone2: [''],
      mobile1: [''],
      mobile2: [''],
      address1: [''], 
      address2: [''], 
      picture: [''],
      status: [''],
      notes: ['']
    });
  }

  // ==========================================
  // ADD CUSTOMER (Smart JSON / Form Data Router)
  // ==========================================
  addCustomer(): void {
    if (this.custForm.invalid || this.isSaving) {
      this.custForm.markAllAsTouched(); 
      return;
    }

    this.isSaving = true;
    
    const formData = new FormData();

    Object.keys(this.custForm.controls).forEach(key => {
      const value = this.custForm.get(key)?.value;
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, '');
      }
    });

    if (this.selectedFile) {
      formData.append('PictureFile', this.selectedFile, this.selectedFile.name);
    }

    this.customerService.create(formData).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Customer created successfully.'
        }).then(() => {
          this.router.navigate(['/customer']);
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
    this.custForm.patchValue({ picture: file.name });
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.custForm.patchValue({ picture: '' });
  }
}