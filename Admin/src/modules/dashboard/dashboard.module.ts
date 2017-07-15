'use strict';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/core';

import { DashboardRouting } from './dashboard.routing';

import { DashboardComponent } from './dashboard.component';

import { MonsterService } from '../../services/monster.service';

@NgModule({
    imports: [
        CommonModule,
        DashboardRouting,
    ],
    declarations: [
        DashboardComponent,
    ],
})
export class DashboardModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DashboardModule,
            providers: [MonsterService],
        };
    };
};
