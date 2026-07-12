import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { EmployeeService } from '../../core/services/employee.service';
import { environment } from '../../core/environment';

@Component({
  selector: 'app-employee-upd',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-upd.html'
})
export class EmpUpdComponent implements OnInit {
  empForm!: FormGroup; 
  employeeId!: number;
  
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.employeeId = Number(idParam);
      this.loadEmpDetails(this.employeeId);
    }
  }

  initForm(): void {
    this.empForm = this.fb.group({
      empId: [0],
      firstName: ['', [Validators.required]],
      lastName: [''],
      age: [null],
      gender: [''],
      dateofBirth: [null],
      email: [''],
      phone: [''],
      mobile: ['', [Validators.required]],
      address: [''], 
      photoPath: [''],
    });
  }

  loadEmpDetails(id: number): void {
    this.employeeService.getById(id).subscribe({
      next: (res: any) => {
        const record = Array.isArray(res) ? res[0] : res;
        if (!record) return;

        let dob = record.dateofBirth || record.DateofBirth || record.dateOfBirth || record.DateOfBirth || '';
        if (dob) {
          dob = dob.split('T')[0];
        }
        this.imagePreview = record.photoPath ? environment.serUrl + record.photoPath : null;
        
        this.empForm.patchValue({
          empId: record.empId || id,
          firstName: record.firstName,
          lastName: record.lastName,
          age: record.age,
          gender: record.gender,
          dateofBirth: dob,
          email: record.email,
          phone: record.phone,
          mobile: record.mobile,
          address: record.address, 
          photoPath: record.photoPath,
        });
      },
      
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to load employee data.', 'error');
      }
    });
  }

  // ==========================================
  // UPDATE employee
  // ==========================================
  updateEmp(): void {
    if (this.empForm.invalid || this.isSaving) {
      this.empForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    // 💡 Always use FormData so the content-type is consistently multipart/form-data
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

    this.employeeService.update(this.employeeId, formData).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Employee details updated successfully.'
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
    this.empForm.patchValue({ photoPath: '' });
  }
}