'use strict';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/core';

import { CrawlerRouting } from './crawler.routing';

import { CrawlerComponent } from './crawler.component';

import { CrawlerService } from '../../services/crawler.service';
import { MonsterService } from '../../services/monster.service';

@NgModule({
    imports: [
        CommonModule,
        CrawlerRouting,
    ],
    declarations: [
        CrawlerComponent,
    ],
})
export class CrawlerModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CrawlerModule,
            providers: [CrawlerService, MonsterService],
        };
    };
};