import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SummMon } from '../../models/monster';

import { MonsterService } from '../../services/monster.service';

@Component({
    selector: 'dashboard-root',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
    private monsters: SummMon[] = [];
    private serverLoc: string = '';

    constructor(private monsterService: MonsterService, private router: Router) { };
    
    ngOnInit(): void {
        this.monsterService.getMonsters().then(monsters => {
            this.monsters = monsters.slice(0, 4);
            this.serverLoc = this.monsterService.base_url;
        });
    };
    
    goToServer(): void {
        window.open(this.serverLoc, '_blank');
    };

    getMonsterClasses(mon: SummMon): string[] {
        return [`mon-type-${ mon.type }`];
    };
};
