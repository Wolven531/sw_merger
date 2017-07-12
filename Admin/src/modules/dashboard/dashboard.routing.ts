'use strict';

import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

const dashboardRoutes: Routes = [
    {
        path: 'dashboard',
        children: [
            {
                path: '',
                component: DashboardComponent,
            },
        ],
    },
];

export const DashboardRouting = RouterModule.forChild(dashboardRoutes);
