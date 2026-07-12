import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductService } from '../../core/services/product.service';
import { SelectlistsService } from '../../core/services/selectlists.service';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,AngularEditorModule],
  templateUrl: './product-add.html'
})
export class ProductAddComponent implements OnInit {
  prodForm!: FormGroup;
  
  suppliers: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];
  selectedFile: File | null = null;
  imageFile1: File | null = null;
  imageFile2: File | null = null;
  imageFile3: File | null = null;
  imageFile4: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private prodService: ProductService,
    private ddlService: SelectlistsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliers();
    this.loadCategories();
  }

  initForm(): void {
    this.prodForm = this.fb.group({
      name: ['', [Validators.required]],
      suppID: ['', [Validators.required]],
      catID: ['', [Validators.required]],
      subCatID: ['', [Validators.required]],
      qtyPerUnit: ['', [Validators.required]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      oldPrice: [0, [Validators.min(0)]],
      unitWeight: [''],
      size: [''],
      disc: [0, [Validators.min(0)]],
      unitInStock: [0, [Validators.required, Validators.min(0)]],
      unitOnOrder: [0, [Validators.min(0)]],
      productAvailable: [true],
      imageURL: [''],
      altText: [''],
      addBadge: [false],
      offerTitle: [''],
      offerBadgeClass: [''],
      shortDesc: [''],
      longDesc: [''],
      note: ''
    });

    this.prodForm.get('catID')?.valueChanges.subscribe((selectedCatId) => {
      this.prodForm.get('subCatID')?.setValue('');
      this.subCategories = [];

      if (selectedCatId) {
        this.loadSubCategories(Number(selectedCatId));
      }
    });
  }

  loadSuppliers() {
    this.ddlService.getSupp().subscribe({
      next: (res: any) => this.suppliers = res,
      error: err => console.error(err)
    });
  }

  loadCategories() {
    this.ddlService.getCat().subscribe({
      next: (res: any) => this.categories = res,
      error: err => console.error(err)
    });
  }

  loadSubCategories(catId: number) {
    this.ddlService.getSubCat(catId).subscribe({
      next: (res: any) => this.subCategories = res,
      error: err => console.error(err)
    });
  }

  addProd(): void {
    if (this.prodForm.invalid || this.isSaving) {
      this.prodForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    // Convert values into standard Form Data object format
    const formData = new FormData();

    // 1. Loop and append standard text inputs
    Object.keys(this.prodForm.controls).forEach(key => {
      const value = this.prodForm.get(key)?.value;
      formData.append(key, value !== null && value !== undefined ? value : '');
    });

  if (this.selectedFile)formData.append('ImageFileDef', this.selectedFile, this.selectedFile.name);
  if (this.imageFile1) formData.append('imageFile1', this.imageFile1, this.imageFile1.name);
  if (this.imageFile2) formData.append('imageFile2', this.imageFile2, this.imageFile2.name);
  if (this.imageFile3) formData.append('imageFile3', this.imageFile3, this.imageFile3.name);
  if (this.imageFile4) formData.append('imageFile4', this.imageFile4, this.imageFile4.name);

    this.prodService.create(formData).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Product with files created successfully.'
        }).then(() => {
          this.router.navigate(['/product']);
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
    this.selectedFile= null;
    this.imagePreview = null;
  }

  onFileSelected(event: any, fileNo: number) {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    switch (fileNo) {
      case 1: this.imageFile1 = file; break;
      case 2: this.imageFile2 = file; break;
      case 3: this.imageFile3 = file; break;
      case 4: this.imageFile4 = file; break;
    }
  }
}