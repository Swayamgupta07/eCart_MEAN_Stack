import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About} from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Login} from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { CustomerDashboard } from './pages/customer/customer-dashboard/customer-dashboard';
import { ProductForm } from './pages/admin/product-form/product-form';
import { adminGuard, customerGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'about', component: About},
  { path: 'contact', component: Contact },
  { path: 'login', component: Login},
  { path: 'signup', component: Signup },
  { path: 'admin-dashboard', component: AdminDashboard, canActivate: [adminGuard] },
  { path: 'admin-dashboard/add-product', component: ProductForm, canActivate: [adminGuard] },
  { path: 'admin-dashboard/edit-product/:id', component: ProductForm, canActivate: [adminGuard] },
  { path: 'customer-dashboard', component: CustomerDashboard, canActivate: [customerGuard] }
];
