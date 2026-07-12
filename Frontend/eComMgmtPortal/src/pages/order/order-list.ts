import { Component, OnInit, signal, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './order-list.html'
})
export class OrderComponent implements OnInit {
  ordersSignal = signal<any[]>([]);
  
  currentPage = signal<number>(1);
  pageSize = signal<number>(50); 
  allowedPageSizes: number[] = [10, 25, 50, 100];
  searchTerm = signal<string>('');
  sortDirection = signal<'asc' | 'desc' | null>(null); 

  processedOrders = computed(() => {
    let list = [...this.ordersSignal()];
    const search = this.searchTerm().toLowerCase().trim();
    const direction = this.sortDirection();

    if (search) {
      list = list.filter(item => {
        const name = item?.name || item?.Name || '';
        const pmtType = item?.pmtType || item?.PmtType || '';
        return name.toLowerCase().includes(search) || pmtType.toLowerCase().includes(search);
      });
    }

    if (direction) {
      list.sort((a, b) => {
        const dateA = new Date(a?.orderDate || a?.OrderDate || 0).getTime();
        const dateB = new Date(b?.orderDate || b?.OrderDate || 0).getTime();
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    return list;
  });


  totalPages = computed(() => {
    return Math.ceil(this.processedOrders().length / this.pageSize()) || 1;
  });

  pagedOrders = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.processedOrders().slice(startIndex, endIndex);
  });

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.orderService.getAllOrdLists().subscribe({
      next: (res: any) => {
        this.ordersSignal.set(res || []); 
      },
      error: (err) => console.error('Failed to load orders', err)
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  toggleSortDate(): void {
    const current = this.sortDirection();
    if (current === null) {
      this.sortDirection.set('asc');
    } else if (current === 'asc') {
      this.sortDirection.set('desc');
    } else {
      this.sortDirection.set(null);
    }
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
}