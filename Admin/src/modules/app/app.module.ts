import { BrowserModule } from '@angular/platform-browser';
// NOTE: NgModel lives in FormsModule
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Http } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from '../app/app.component';

import { AppRoutingModule } from './app-routing.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { MonsterModule } from '../monster/monster.module';

import { MonsterService } from '../../services/monster.service';
import { MonsterSearchService } from '../../services/monster-search.service';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        DashboardModule.forRoot(),
        MonsterModule.forRoot(),
    ],
    providers: [MonsterService, MonsterSearchService],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(
        private monsterService: MonsterService,
        private monsterSearchService: MonsterSearchService,
        private http: Http
    ) { };
};
