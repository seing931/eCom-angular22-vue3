import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductService } from '../../core/services/product.service';
import { SelectlistsService } from '../../core/services/selectlists.service';
import { environment } from '../../core/environment';

@Component({
  selector: 'app-product-upd',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,AngularEditorModule],
  templateUrl: './product-upd.html'
})
export class ProductUpdComponent implements OnInit {
  prodForm!: FormGroup;
  productId!: number;
  
  suppliers: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];
  selectedFile: File | null = null;
  imageFile1: File | null = null;
  imageFile2: File | null = null;
  imageFile3: File | null = null;
  imageFile4: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  imagePreview1: string | ArrayBuffer | null = null;
  imagePreview2: string | ArrayBuffer | null = null;
  imagePreview3: string | ArrayBuffer | null = null;
  imagePreview4: string | ArrayBuffer | null = null;

  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private prodService: ProductService,
    private ddlService: SelectlistsService,
    private router: Router,
    private route: ActivatedRoute // Used to read the id parameter from URL
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadSuppliers();
    this.loadCategories();

    // Read ID from route parameters (e.g., /product/edit/5)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = +idParam;
      this.loadProductDetails(this.productId);
    }
  }

  initForm(): void {
    this.prodForm = this.fb.group({
      prodID: [0], // Hidden track keeper matching model.ProdID back-end expectations
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
      picture1: [''],
      picture2: [''],
      picture3: [''],
      picture4: [''],
      note: ''
    });

    this.prodForm.get('catID')?.valueChanges.subscribe((selectedCatId) => {
      if (this.prodForm.get('catID')?.dirty) {
        this.prodForm.get('subCatID')?.setValue('');
        this.subCategories = [];
      }

      if (selectedCatId) {
        this.loadSubCategories(Number(selectedCatId));
      }
    });
  }

 loadProductDetails(id: number): void {
  this.prodService.getById(id).subscribe({
    next: (product: any) => {
      const categoryId = product.catID;
      const subCategoryId = product.subCatID;

      if (categoryId) {
        this.ddlService.getSubCat(Number(categoryId)).subscribe({
          next: (subRes: any) => {
            this.subCategories = subRes;

            this.prodForm.patchValue({
              prodID: product.prodID || product.productID,
              name: product.name,
              suppID: product.supplierID || product.suppID,
              catID: categoryId,
              subCatID: subCategoryId,
              qtyPerUnit: product.quantityPerUnit || product.qtyPerUnit,
              unitPrice: product.unitPrice,
              oldPrice: product.oldPrice,
              unitWeight: product.unitWeight,
              size: product.size,
              disc: product.discount || product.disc,
              unitInStock: product.unitInStock,
              unitOnOrder: product.unitOnOrder,
              productAvailable: product.productAvailable,
              imageURL: product.imageURL,
              altText: product.altText,
              addBadge: product.addBadge,
              offerTitle: product.offerTitle,
              offerBadgeClass: product.offerBadgeClass,
              shortDesc: product.shortDescription || product.shortDesc,
              longDesc: product.longDescription || product.longDesc,
              picture1:product.picture1,
              picture2:product.picture2,
              picture3:product.picture3,
              picture4:product.picture4,
              note: product.note
            });
          },
          error: err => console.error('Error fetching initial subcategories:', err)
        });
      }

      this.imagePreview = product.imageURL ? environment.serUrl + product.imageURL : null;
      this.imagePreview1 = product.picture1 ? environment.serUrl + product.picture1 : null;
      this.imagePreview2 = product.picture2 ? environment.serUrl + product.picture2 : null;
      this.imagePreview3 = product.picture3 ? environment.serUrl + product.picture3 : null;
      this.imagePreview4 = product.picture4 ? environment.serUrl + product.picture4 : null;

    },
    error: err => {
      console.error(err);
      Swal.fire('Error', 'Could not load existing product records.', 'error');
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

  updateProd(): void {
    if (this.prodForm.invalid || this.isSaving) {
      this.prodForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formData = new FormData();

    // 1. Append form value keys
    Object.keys(this.prodForm.controls).forEach(key => {
      const value = this.prodForm.get(key)?.value;
      formData.append(key, value !== null && value !== undefined ? value : '');
    });

  if (this.selectedFile)formData.append('ImageFileDef', this.selectedFile, this.selectedFile.name);
  if (this.imageFile1) formData.append('imageFile1', this.imageFile1, this.imageFile1.name);
  if (this.imageFile2) formData.append('imageFile2', this.imageFile2, this.imageFile2.name);
  if (this.imageFile3) formData.append('imageFile3', this.imageFile3, this.imageFile3.name);
  if (this.imageFile4) formData.append('imageFile4', this.imageFile4, this.imageFile4.name);

    this.prodService.update(this.productId, formData).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: 'Product updated safely.'
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
    this.imagePreview = null;
    this.selectedFile= null;
  }

 onFileSelected(event: any, fileNo: number) {
  if (!event.target.files || event.target.files.length === 0) return;
  const file = event.target.files[0];

  // Store the raw file for upload
  switch (fileNo) {
    case 1: this.imageFile1 = file; break;
    case 2: this.imageFile2 = file; break;
    case 3: this.imageFile3 = file; break;
    case 4: this.imageFile4 = file; break;
  }

  // Generate the local base64 preview
  const reader = new FileReader();
  reader.onload = () => {
    switch (fileNo) {
      case 1: this.imagePreview1 = reader.result; break;
      case 2: this.imagePreview2 = reader.result; break;
      case 3: this.imagePreview3 = reader.result; break;
      case 4: this.imagePreview4 = reader.result; break;
    }
  };
    reader.readAsDataURL(file); // This starts the conversion process
  }
}