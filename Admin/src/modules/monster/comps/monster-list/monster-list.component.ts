'use strict';

import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SummMon } from '../../../../models/monster';

import { MonsterService } from '../../../../services/monster.service';

@Component({
    selector: 'app-monster-list',
    templateUrl: './monster-list.component.html',
    styleUrls: ['./monster-list.component.css'],
})
export class MonsterListComponent implements OnInit {
    private monsters: SummMon[] = [];
    private selectedMon: SummMon = null;

    constructor(private router: Router, private monsterService: MonsterService) { };

    ngOnInit(): void {
        this.monsterService.getMonsters().then(monsters => {
            this.monsters = monsters;
        });
    };

    onSelect(mon: SummMon): void {
        this.selectedMon = mon;
    };

    goToDetail(): void {
        this.router.navigate(['/monster/detail', this.selectedMon.id]);
    };

    getMonsterClasses(mon: SummMon): string[] {
        return [`mon-type-${mon.type}`];
    };
};
