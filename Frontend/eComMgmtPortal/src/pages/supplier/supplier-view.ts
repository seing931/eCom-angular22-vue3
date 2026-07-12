import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core'; // 💡 Added signal
import { ActivatedRoute, RouterModule } from '@angular/router'; // 💡 Added RouterModule
import { SupplierService } from '../../core/services/supplier.service';

@Component({
  standalone: true,
  selector: 'app-supplier-view',
  imports: [CommonModule, RouterModule], // 💡 Added RouterModule here
  templateUrl: './supplier-view.html'
})
export class SupplierViewComponent implements OnInit {

  // 💡 Initialize async model data cleanly within a Signal wrapper
  suppSignal = signal<any>(null);

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.supplierService.getById(id).subscribe({
      next: (res: any) => {
        // 💡 Handle array unpacking or direct assignment safely
        const record = Array.isArray(res) ? res[0] : res;
        this.suppSignal.set(record);
      },
      error: (err) => {
        console.error('Error fetching supplier record:', err);
      }
    });
  }
}