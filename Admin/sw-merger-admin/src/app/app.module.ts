import { BrowserModule } from '@angular/platform-browser';
// NOTE: NgModel lives in FormsModule
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from '../comps/app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from '../comps/dashboard/dashboard.component';

import { MonsterDetailComponent } from '../comps/monster-detail/monster-detail.component';
import { MonstersComponent } from '../comps/monsters//monsters.component';
import { MonsterSearchComponent } from '../comps/monster-search/monster-search.component';
import { MonsterService } from '../services/monster.service';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        MonsterDetailComponent,
        MonstersComponent,
        MonsterSearchComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
    ],
    providers: [MonsterService],
    bootstrap: [AppComponent],
})
export class AppModule {

};
