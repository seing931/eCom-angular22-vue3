import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core'; // 💡 Added signal
import { ActivatedRoute, RouterModule } from '@angular/router'; // 💡 Added RouterModule
import { OrderService } from '../../core/services/order.service';

@Component({
  standalone: true,
  selector: 'app-order-details',
  imports: [CommonModule, RouterModule], // 💡 Make sure RouterModule is explicitly imported
  templateUrl: './order-details.html'
})
export class OrderDetailsComponent implements OnInit {

  // 💡 Maintain structural object records inside a Signal wrapper box
  orderSignal = signal<any>({
    sumQty: 0,
    sumAmt: 0,
    sumAmtAftDisc: 0, // 💡 Fixed Pascal vs camelCase property spelling trap
    items: []
  });

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.orderService.getById(id).subscribe({
      next: (res: any) => {
        // Handle array unpacking or standard response payloads safely
        const record = Array.isArray(res) ? res[0] : res;
        this.orderSignal.set(record);
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
      }
    });
  }
}