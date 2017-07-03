import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { SummMon } from './monster';
import { MonsterService } from './monster.service';

@Component({
    selector: 'dashboard-root',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
    monsters: SummMon[] = [];
    constructor(private monsterService: MonsterService) {

    };
    ngOnInit(): void {
        this.monsterService.getMonsters().then(monsters => this.monsters = monsters.slice(0, 4));
    };
    getMonsterClasses(mon: SummMon): string[] {
        return [`mon-type-${ mon.type }`];
    };
};
