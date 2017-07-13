'use strict';

import { BrowserModule } from '@angular/platform-browser';
// NOTE: NgModel lives in FormsModule
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Http } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from '../app/app.component';

import { AppRoutingModule } from './app-routing.module';
import { CrawlerModule } from '../crawler/crawler.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { GeneratorModule } from '../generator/generator.module';
import { MonsterModule } from '../monster/monster.module';

import { CrawlerService } from '../../services/crawler.service';
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
        CrawlerModule.forRoot(),
        DashboardModule.forRoot(),
        GeneratorModule.forRoot(),
        MonsterModule.forRoot(),
    ],
    providers: [CrawlerService, MonsterService, MonsterSearchService],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(
        private crawlerService: CrawlerService,
        private monsterService: MonsterService,
        private monsterSearchService: MonsterSearchService,
        private http: Http
    ) { };
};
