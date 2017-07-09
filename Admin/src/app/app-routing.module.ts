import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { ApiConfigerComponent } from '../comps/api-configer/api-configer.component';
import { DashboardComponent } from '../comps/dashboard/dashboard.component';
import { MonstersComponent } from '../comps/monsters/monsters.component';
import { MonsterDetailComponent } from '../comps/monster-detail/monster-detail.component';

const routes: Routes = [
    { path: '', redirectTo: '/api-configer', pathMatch: 'full', },
    { path: 'api-configer',  component: ApiConfigerComponent, },
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
