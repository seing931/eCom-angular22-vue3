import { Component, OnInit, signal, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 
import Swal from 'sweetalert2';
import { SupplierService } from '../../core/services/supplier.service';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './supplier-list.html'
})
export class SupplierComponent implements OnInit {
  suppliersSignal = signal<any[]>([]);
  
  currentPage = signal<number>(1);
  pageSize = signal<number>(50); 
  allowedPageSizes: number[] = [10, 25, 50, 100];
  searchTerm = signal<string>('');

  filteredSuppliers = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const allSuppliers = this.suppliersSignal();

    if (!search) return allSuppliers;

    return allSuppliers.filter(item => {
      const compName = item?.compName || item?.CompName || '';
      const contactName = item?.contactName || item?.ContactName || '';
      
      return compName.toLowerCase().includes(search) || 
             contactName.toLowerCase().includes(search);
    });
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredSuppliers().length / this.pageSize()) || 1;
  });

  pagedSuppliers = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.filteredSuppliers().slice(startIndex, endIndex);
  });

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.supplierService.getAll().subscribe({
      next: (res: any) => {
        this.suppliersSignal.set(res || []);
      },
      error: (err) => console.error('Failed to load suppliers', err)
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize.set(Number(newSize));
    this.currentPage.set(1); 
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  deleteSup(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This record will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.supplierService.delete(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Supplier has been deleted.', 'success');
            this.loadData(); 
          },
          error: (err) => {
            let message = 'Failed to delete record.';
            if (err?.error) {
              if (typeof err.error === 'string') message = err.error;
              else if (err.error?.message) message = err.error.message;
            }
            Swal.fire('Error!', message, 'error');
          }
        });
      }
    });
  }
}