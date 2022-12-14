import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './register/register/register.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  // On charge paresseument notre route :
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule) //loadChildren : import(<chemin_relatif>).then(m => m.<classe_du_module>)
 },
  {
     path: 'register',
      loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) 
    },
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
