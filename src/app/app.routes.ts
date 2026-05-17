import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BoxBuilderComponent } from './components/box-builder/box-builder.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'customize', component: BoxBuilderComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
