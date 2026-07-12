import { Component, OnInit, OnDestroy, signal } from '@angular/core'; // 💡 Added signal
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router'; 
import { ChartType, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { Dashmodel } from '../../models/dashmodel';
import { environment } from '../../core/environment';
import { Subscription } from 'rxjs'; 
import { filter } from 'rxjs/operators'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [DatePipe],
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit, OnDestroy { 

  // 💡 Switch your structural data to a Signal so *ngIf matches instantly
  summarySignal = signal<Dashmodel | null>(null);
  
  lineChartType: ChartType = 'line';
  private routerSubscription!: Subscription;

  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadAll();

    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadAll(); 
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadAll(): void {
    this.loadSummary();
    this.loadSales();
    this.loadProducts();
    this.loadOrders();
    this.loadCountries();
  }

  // =======================
  // KPI SUMMARY
  // =======================
  loadSummary() {
    this.http.get<Dashmodel>(`${environment.apiUrl}/dash/summary`)
      .subscribe(res => {
        this.summarySignal.set(res); // 💡 Set the signal value
      });
  }

  // =======================
  // LINE CHART - SALES
  // =======================
  lineChartSalesType: ChartType = 'line';
  lineChartSalesData: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [], label: 'Sales' }] };

  loadSales() {
    this.http.get<any[]>(`${environment.apiUrl}/dash/sales-per-day`)
      .subscribe(data => {
        // 💡 Modify properties directly to maintain reference binding
        this.lineChartSalesData.labels = data.map(x => this.datePipe.transform(x.date, 'yyyy-MM-dd'));
        this.lineChartSalesData.datasets = [
          {
            data: data.map(x => x.sales),
            label: 'Sales',
            borderColor: '#1e88e5',   
            backgroundColor: 'rgba(30, 136, 229, 0.2)', 
            pointBackgroundColor: '#1e88e5',
            pointBorderColor: '#1e88e5',
            tension: 0.4,
            fill: true
          }
        ];
      });
  }

  // =======================
  // PIE CHART - PRODUCTS
  // =======================
  pieChartType: ChartType = 'pie';
  pieChartData: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [] }] };

  loadProducts() {
    this.http.get<any[]>(`${environment.apiUrl}/dash/top-products`)
      .subscribe(data => {
        this.pieChartData.labels = data.map(x => x.label);
        this.pieChartData.datasets = [
          {
            data: data.map(x => x.value),
            backgroundColor: ['#eed76b', '#C0C0C0', '#CD7F32'],
            borderColor: '#ffffff',
            borderWidth: 2
          }
        ];
      });
  }

  // =======================
  // LINE CHART - ORDERS
  // =======================
  lineChartOrderType: ChartType = 'line';
  lineChartOrderData: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [], label: 'Orders Per Day' }] };

  loadOrders() {
    this.http.get<any[]>(`${environment.apiUrl}/dash/orders-per-day`)
      .subscribe(data => {
        this.lineChartOrderData.labels = data.map(x => new Date(x.date).toLocaleDateString());
        this.lineChartOrderData.datasets = [
          {
            data: data.map(x => x.orders),
            label: 'Orders Per Day',
            tension: 0.4,
            borderColor: '#5cb85c',   
            backgroundColor: 'rgba(92, 184, 92, 0.2)', 
            pointBackgroundColor: '#5cb85c', 
            pointBorderColor: '#5cb85c'
          }
        ];
      });
  }

  // =======================
  // BAR CHART - COUNTRY SALES
  // =======================
  barChartType: ChartType = 'bar';
  barChartData: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [], label: 'Sales' }] };

  loadCountries() {
    this.http.get<any[]>(`${environment.apiUrl}/dash/sales-by-country`)
      .subscribe(data => {
        this.barChartData.labels = data.map(x => x.country);
        this.barChartData.datasets = [
          {
            data: data.map(x => x.sales),
            label: 'Sales',
            backgroundColor: '#d9534f', 
            borderColor: '#d9534f',     
            borderWidth: 1
          }
        ];
      });
  }
}