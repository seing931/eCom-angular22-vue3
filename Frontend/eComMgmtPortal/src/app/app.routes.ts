import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../shared/layout';
import { LoginComponent } from '../pages/login/login';
import { DashboardComponent } from '../pages/dashboard/dashboard';
import { ProfileComponent } from '../pages/profile/profile';
import { SettingComponent } from '../pages/setting/setting';
import { OrderComponent } from '../pages/order/order-list';
import { OrderDetailsComponent } from '../pages/order/order-details';
import { ProductComponent } from '../pages/product/product-list';
import { ProductAddComponent } from '../pages/product/product-add';
import { ProductUpdComponent } from '../pages/product/product-upd';
import { ProductViewComponent } from '../pages/product/product-view';
import { CustomerComponent } from '../pages/customer/customer-list';
import { CustomerAddComponent } from '../pages/customer/customer-add';
import { CustomerUpdComponent } from '../pages/customer/customer-upd';
import { CustomerViewComponent } from '../pages/customer/customer-view';
import { SupplierComponent } from '../pages/supplier/supplier-list';
import { SupplierAddComponent } from '../pages/supplier/supplier-add';
import { SupplierUpdComponent } from '../pages/supplier/supplier-upd';
import { SupplierViewComponent } from '../pages/supplier/supplier-view';
import { EmpComponent } from '../pages/employee/employee-list';
import { EmpAddComponent } from '../pages/employee/employee-add';
import { EmpUpdComponent } from '../pages/employee/employee-upd';
import { EmpViewComponent } from '../pages/employee/employee-view';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }, 
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: 'profile', component: ProfileComponent},
      { path: 'setting', component: SettingComponent},
      { path: 'order', component: OrderComponent },
      { path: 'order-details/:id', component: OrderDetailsComponent },
      { path: 'product', component: ProductComponent },
      { path: 'product-add', component: ProductAddComponent },
      { path: 'product-upd/:id', component: ProductUpdComponent },
      { path: 'product-view/:id', component: ProductViewComponent},
      { path: 'customer', component: CustomerComponent },
      { path: 'customer-add', component: CustomerAddComponent},
      { path: 'customer-upd/:id', component: CustomerUpdComponent},
      { path: 'customer-view/:id', component: CustomerViewComponent},
      { path: 'supplier', component: SupplierComponent },
      { path: 'supplier-add', component: SupplierAddComponent },
      { path: 'supplier-upd/:id', component: SupplierUpdComponent },
      { path: 'supplier-view/:id', component: SupplierViewComponent},
      { path: 'employee', component: EmpComponent },
      { path: 'employee-add', component: EmpAddComponent },
      { path: 'employee-upd/:id', component: EmpUpdComponent },
      { path: 'employee-view/:id', component: EmpViewComponent}
    ]
  }  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }) // <--- Injected here
  ],
  exports: [RouterModule]
})
export class AppRouting { }