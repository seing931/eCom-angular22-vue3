import { Component, OnInit, signal, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 
import Swal from 'sweetalert2';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './product-list.html'
})
export class ProductComponent implements OnInit {
  prodsSignal = signal<any[]>([]);
  
  currentPage = signal<number>(1);
  pageSize = signal<number>(50); 
  allowedPageSizes: number[] = [10, 25, 50, 100];
  searchTerm = signal<string>('');

  filteredProds = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const allProds = this.prodsSignal();
    
    if (!search) return allProds;

    return allProds.filter(item => {
      // Safely check both camelCase and PascalCase properties
      const name = item?.name || item?.Name || '';
      return name.toLowerCase().includes(search);
    });
  });

 
  totalPages = computed(() => {
    return Math.ceil(this.filteredProds().length / this.pageSize()) || 1;
  });

  pagedProds = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.filteredProds().slice(startIndex, endIndex);
  });

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.productService.getAll().subscribe({
      next: (res: any) => {
        this.prodsSignal.set(res || []);
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  // 💡 5. Helper method to update search term and reset page back to 1
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

  deleteProd(id: number): void {
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
        this.productService.delete(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
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