import { Component } from '@angular/core';
import { SummMon } from './monster';
import { MonsterService } from './monster.service';
import { OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [MonsterService],
})
export class AppComponent implements OnInit {
    title = 'SW-Merger Admin Tool';
    monsters: SummMon[];
    selectedMon: SummMon;
    constructor(private monsterService: MonsterService) {
    
    };
    onSelect(mon: SummMon): void {
        this.selectedMon = mon;
    };
    getMonsters(): void {
        this.monsterService
            .getMonsters()
            .then(monsters => this.monsters = monsters);
    };
    ngOnInit(): void {
        this.getMonsters();
    };
};
