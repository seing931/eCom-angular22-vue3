import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { SupplierService } from '../../core/services/supplier.service';

@Component({
  selector: 'app-supplier-upd',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './supplier-upd.html'
})
export class SupplierUpdComponent implements OnInit {
  suppForm!: FormGroup; 
  supplierId!: number;
  
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.supplierId = Number(idParam);
      this.loadsupplierDetails(this.supplierId);
    }
  }

  initForm(): void {
    this.suppForm = this.fb.group({
      suppId: [0],
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

  loadsupplierDetails(id: number): void {
    this.supplierService.getById(id).subscribe({
      next: (res: any) => {
        const record = Array.isArray(res) ? res[0] : res;
        if (!record) return;

        this.suppForm.patchValue({
          suppId: record.suppId || record.SuppId || id,
          compName: record.compName || record.CompName,
          contactName: record.contactName || record.ContactName,
          contactTitle: record.contactTitle || record.ContactTitle,
          email: record.email || record.Email,
          phone: record.phone || record.Phone,
          mobile: record.mobile || record.Mobile,
          fax: record.fax || record.Fax,
          city: record.city || record.City,
          country: record.country || record.Country,
          address: record.address || record.Address
        });
        
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load supplier data.', 'error');
      }
    });
  }

  // ==========================================
  // UPDATE supplier (Smart Payload Handling)
  // ==========================================
  updateSupplier(): void {
    if (this.suppForm.invalid || this.isSaving) {
      this.suppForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    let updateObservable;

    const { picture, ...cleanPayload } = this.suppForm.value;

    updateObservable = this.supplierService.update(this.supplierId, cleanPayload);

    updateObservable.subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Supplier details updated successfully.'
        }).then(() => {
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
}