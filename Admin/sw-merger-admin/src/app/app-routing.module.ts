import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { DashboardComponent } from '../comps/dashboard/dashboard.component';
import { MonstersComponent } from '../comps/monsters/monsters.component';
import { MonsterDetailComponent } from '../comps/monster-detail/monster-detail.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full', },
    { path: 'dashboard',  component: DashboardComponent, },
    { path: 'monsters/detail/:id', component: MonsterDetailComponent, },
    { path: 'monsters', component: MonstersComponent, },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {

};
