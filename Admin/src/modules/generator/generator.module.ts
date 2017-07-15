'use strict';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/core';

import { GeneratorRouting } from './generator.routing';

import { GeneratorComponent } from './generator.component';
import { MonsterModule } from '../../modules/monster/monster.module';

import { MonsterService } from '../../services/monster.service';

@NgModule({
    imports: [
        CommonModule,
        GeneratorRouting,
        MonsterModule,
    ],
    declarations: [
        GeneratorComponent,
    ],
})
export class GeneratorModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: GeneratorModule,
            providers: [MonsterService],
        };
    };
};
