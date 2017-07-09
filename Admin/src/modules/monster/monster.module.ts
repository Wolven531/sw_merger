import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { ModuleWithProviders } from '@angular/core';

import { MonsterRouting } from './monster.routing';

import { MonsterDetailComponent } from './comps/monster-detail/monster-detail.component';
import { MonsterListComponent } from './comps/monster-list/monster-list.component';
import { MonsterSearchComponent } from './comps/monster-search/monster-search.component';

import { MonsterService } from '../../services/monster.service';
import { MonsterSearchService } from '../../services/monster-search.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MonsterRouting,
    ],
    declarations: [
        MonsterDetailComponent,
        MonsterSearchComponent,
        MonsterListComponent,
    ],
})
export class MonsterModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MonsterModule,
            providers: [
                MonsterService,
                MonsterSearchService,
            ],
        };
    };
};
