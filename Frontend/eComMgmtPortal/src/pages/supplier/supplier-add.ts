import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { SupplierService } from '../../core/services/supplier.service';

@Component({
  selector: 'app-supplier-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // 💡 Swapped to ReactiveFormsModule
  templateUrl: './supplier-add.html'
})
export class SupplierAddComponent implements OnInit {
  suppForm!: FormGroup; // 💡 Converted from model object to typed FormGroup
  isSaving = false;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // 💡 Define explicit Reactive controls with validators matching the Product schema setup
  initForm(): void {
    this.suppForm = this.fb.group({
      compName: ['', [Validators.required]], // Added required validation check
      contactName: ['', [Validators.required]],
      contactTitle: [''],
      email: [''],
      phone: [''],
      mobile: [''],
      fax: [''],
      city: [''],
      country: [''],
      address: ['']
    });
  }
  // ==========================================
  // ADD Supplier (Smart JSON / Form Data Router)
  // ==========================================
  addSupp(): void {
    if (this.suppForm.invalid || this.isSaving) {
      this.suppForm.markAllAsTouched(); // Highlights invalid fields if user submits prematurely
      return;
    }

    this.isSaving = true;
    let createObservable;

    // 🛠️ Check if a file was actually selected to determine the payload formatting
    if (this.selectedFile) {
      const formData = new FormData();

      // Append standard text input entries
      Object.keys(this.suppForm.controls).forEach(key => {
        const value = this.suppForm.get(key)?.value;
        formData.append(key, value !== null && value !== undefined ? value : '');
      });

      // Append selected binary image file
      formData.append('file', this.selectedFile, this.selectedFile.name);
      
      createObservable = this.supplierService.create(formData);
    } else {
      // ⚡ No file selected: send lightweight JSON payload context directly
      createObservable = this.supplierService.create(this.suppForm.value);
    }

    createObservable.subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Supplier created successfully.'
        }).then(() => {
          // 💡 Safe spa-routing navigation redirect loop context mapping
          this.router.navigate(['/supplier']);
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

  onFileChange(event: any): void {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  
  clearImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.suppForm.patchValue({ picture: '' });
  }
}