import { Routes } from '@angular/router';
import { BlogComponent } from './blog.component';

export const routes: Routes = [
  { path: 'blog', component: BlogComponent },
  { path: '', redirectTo: 'blog', pathMatch: 'full' }
];