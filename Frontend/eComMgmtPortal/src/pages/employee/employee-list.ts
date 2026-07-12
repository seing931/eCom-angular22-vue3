import { Component, OnInit, signal, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 
import Swal from 'sweetalert2';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './employee-list.html'
})
export class EmpComponent implements OnInit {
  employeesSignal = signal<any[]>([]);
  
  // 💡 Converted pagination states into tracking Signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(50); 
  allowedPageSizes: number[] = [10, 25, 50, 100];

  // 💡 Updated computed tracking dependencies via functional invocation
  totalPages = computed(() => {
    return Math.ceil(this.employeesSignal().length / this.pageSize()) || 1;
  });

  pagedEmployees = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.employeesSignal().slice(startIndex, endIndex);
  });

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.employeeService.getAll().subscribe({
      next: (res: any) => {
        this.employeesSignal.set(res || []);
      },
      error: (err) => console.error('Failed to load employees', err)
    });
  }

  // 💡 Setting state cleanly via Signal API
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

  deleteEmp(id: number): void {
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
        this.employeeService.delete(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
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