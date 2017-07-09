import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SummMon } from '../../models/monster';
import { MonsterService } from '../../services/monster.service';
import { AppComponent } from '../app/app.component';

@Component({
    selector: 'monsters-root',
    templateUrl: './monsters.component.html',
    styleUrls: ['./monsters.component.css'],
})
export class MonstersComponent implements OnInit {
    monsters: SummMon[];
    selectedMon: SummMon;
    constructor(private router: Router, private monsterService: MonsterService) {
    
    };
    onSelect(mon: SummMon): void {
        this.selectedMon = mon;
    };
    getMonsters(): void {
        this.monsterService.getMonsters().then(monsters => this.monsters = monsters);
    };
    getMonsterClasses(mon: SummMon): string[] {
        return [`mon-type-${ mon.type }`];
    };
    goToDetail(): void {
        this.router.navigate(['/monsters/detail', this.selectedMon.id]);
    };
    ngOnInit(): void {
        this.getMonsters();
    };
};