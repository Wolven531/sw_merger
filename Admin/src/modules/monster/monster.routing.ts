'use strict';

import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { MonsterDetailComponent } from './comps/monster-detail/monster-detail.component';
import { MonsterListComponent } from './comps/monster-list/monster-list.component';
import { MonsterSearchComponent } from './comps/monster-search/monster-search.component';

const monsterRoutes: Routes = [
    {
        path: 'monster',
        children: [
            {
                path: 'list',
                component: MonsterListComponent,
            },
            {
                path: 'search',
                component: MonsterSearchComponent,
            },
            {
                path: 'detail/:id',
                component: MonsterDetailComponent,
            },
        ],
    },
];

export const MonsterRouting = RouterModule.forChild(monsterRoutes);
