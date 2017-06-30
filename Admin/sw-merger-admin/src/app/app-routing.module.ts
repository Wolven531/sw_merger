import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { MonstersComponent } from './monsters.component';
import { MonsterDetailComponent } from './monster-detail.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full', },
    { path: 'dashboard',  component: DashboardComponent, },
    { path: 'detail/:id', component: MonsterDetailComponent, },
    { path: 'monsters', component: MonstersComponent, },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {

};
