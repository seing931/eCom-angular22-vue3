import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CustomerService } from '../../core/services/customer.service';
import { environment } from '../../core/environment';

@Component({
  selector: 'app-customer-upd',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './customer-upd.html'
})
export class CustomerUpdComponent implements OnInit {
  custForm!: FormGroup; 
  customerId!: number;
  
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.customerId = Number(idParam);
      this.loadCustomerDetails(this.customerId);
    }
  }

  initForm(): void {
    this.custForm = this.fb.group({
      custId: [0],
      firstName: ['', [Validators.required]],
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

  loadCustomerDetails(id: number): void {
    this.customerService.getById(id).subscribe({
      next: (res: any) => {
        const record = Array.isArray(res) ? res[0] : res;
        if (!record) return;

        let dob = record.dateofBirth || record.DateofBirth || record.dateOfBirth || record.DateOfBirth || '';
        if (dob) {
          dob = dob.split('T')[0];
        }

        this.custForm.patchValue({
          custId: record.custId || id,
          firstName: record.firstName,
          lastName: record.lastName,
          userName: record.userName,
          password: record.password,
          age: record.age,
          gender: record.gender,
          dateofBirth: dob,
          organization: record.organization,
          country: record.country,
          state: record.state,
          city: record.city,
          postalCode: record.postalCode,
          email: record.email,
          altEmail: record.altEmail,
          phone1: record.phone1,
          phone2: record.phone2,
          mobile1: record.mobile1,
          mobile2: record.mobile2,
          address1: record.address1, 
          address2: record.address2, 
          picture: record.picture,
          status: record.status,
          notes: record.notes
        });

        this.imagePreview = record.picture ? environment.serUrl + record.picture : null;

      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load customer data.', 'error');
      }
    });
  }

  // ==========================================
  // UPDATE CUSTOMER (Smart Payload Handling)
  // ==========================================
  updateCustomer(): void {
    if (this.custForm.invalid || this.isSaving) {
      this.custForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    // 💡 FIX 1: Always construct a FormData schema container
    const formData = new FormData();

    // Map your reactive form values safely to the multipart boundaries
    Object.keys(this.custForm.controls).forEach(key => {
      const value = this.custForm.get(key)?.value;
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, '');
      }
    });

    // 💡 FIX 2: Change parameter property tag context name from 'file' to 'PictureFile'
    if (this.selectedFile) {
      formData.append('PictureFile', this.selectedFile, this.selectedFile.name);
    }

    this.customerService.update(this.customerId, formData).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Customer details updated successfully.'
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
    this.custForm.patchValue({ picture: '' });
  }
}