import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core'; // 💡 Added signal
import { ActivatedRoute, RouterModule } from '@angular/router'; // 💡 Added RouterModule
import { ProductService } from '../../core/services/product.service';
import { environment } from '../../core/environment';

@Component({
  standalone: true,
  selector: 'app-product-view', // 💡 Fixed selector name to match context
  imports: [CommonModule, RouterModule], // 💡 Added RouterModule here
  templateUrl: './product-view.html'
})
export class ProductViewComponent implements OnInit {
  
  readonly imgBaseServ = environment.serUrl;
  prodSignal = signal<any>(null);

  constructor(
    private route: ActivatedRoute,
    private prdService: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.prdService.getById(id).subscribe({
      next: (res: any) => {
        // Handle array unpacking or direct item assignment safely
        const record = Array.isArray(res) ? res[0] : res;
        this.prodSignal.set(record);
      },
      error: (err) => {
        console.error('Error fetching product record:', err);
      }
    });
  }
}