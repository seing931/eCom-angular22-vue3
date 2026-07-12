import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core'; // 💡 Added signal
import { ActivatedRoute, RouterModule } from '@angular/router'; // 💡 Added RouterModule
import { EmployeeService } from '../../core/services/employee.service';
import { environment } from '../../core/environment';

@Component({
  standalone: true,
  selector: 'app-employee-view',
  imports: [CommonModule, RouterModule], // 💡 Added RouterModule here
  templateUrl: './employee-view.html'
})
export class EmpViewComponent implements OnInit {
  empSignal = signal<any>(null);
  readonly imgBaseServ = environment.serUrl;
  
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.employeeService.getById(id).subscribe({
      next: (res: any) => {
        // 💡 Handle array unpacking or direct assignment safely
        const record = Array.isArray(res) ? res[0] : res;
        this.empSignal.set(record);
      },
      error: (err) => {
        console.error('Error fetching employee record:', err);
      }
    });
  }
}