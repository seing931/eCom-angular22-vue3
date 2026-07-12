import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core'; // 💡 Added signal
import { ActivatedRoute, RouterModule } from '@angular/router'; // 💡 Added RouterModule
import { CustomerService } from '../../core/services/customer.service';
import { environment } from '../../core/environment';

@Component({
  standalone: true,
  selector: 'app-customer-view',
  imports: [CommonModule, RouterModule], // 💡 Added RouterModule here
  templateUrl: './customer-view.html'
})
export class CustomerViewComponent implements OnInit {
  custSignal = signal<any>(null);
  readonly imgBaseServ = environment.serUrl;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.customerService.getById(id).subscribe({
      next: (res: any) => {
        // 💡 Handle array unpacking or direct assignment safely
        const record = Array.isArray(res) ? res[0] : res;
        this.custSignal.set(record);
      },
      error: (err) => {
        console.error('Error fetching customer record:', err);
      }
    });
  }
}