import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {HomeComponent} from './system/home/home.component'; 
import { PageAboutComponent } from './system/page-about/page-about.component';
import { PageProjectComponent } from './system/page-project/page-project.component';
import { HomeworegComponent } from './system/homeworeg/homeworeg.component';
import { PageProfileComponent } from './system/page-profile/page-profile.component';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './shared/auth.service';
import { DataService } from './shared/data.service';
import { AdminPageComponent } from './system/admin-page/admin-page.component';
import { AuthAdminComponent } from './auth/auth-admin/auth-admin.component';
import { AuthAdminService } from './shared/authadmin.service';

export const routes: Routes = [
    {path:'', redirectTo: 'homeworeg', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'homeworeg', component: HomeworegComponent},
    {path: 'page-project', component: PageProjectComponent},
    {path: 'page-profile', component: PageProfileComponent},
    {path: 'page-about', component: PageAboutComponent},
    { path: 'auth', component: AuthComponent },
    {path: 'admin-page', component: AdminPageComponent  },
    {path: 'Ut8jlWtTVpE6wI', component: AuthAdminComponent   }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [DataService, AuthService, AuthAdminService]
})

export class SystemRoutingModule{}