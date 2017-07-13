'use strict';

import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { CrawlerComponent } from './crawler.component';

const crawlerRoutes: Routes = [
    {
        path: 'crawler',
        children: [
            {
                path: '',
                component: CrawlerComponent,
            },
        ],
    },
];

export const CrawlerRouting = RouterModule.forChild(crawlerRoutes);
