'use strict';

import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SummMon } from '../../models/monster';

import { MonsterService } from '../../services/monster.service';

@Component({
    selector: 'app-generator',
    templateUrl: './generator.component.html',
    styleUrls: ['./generator.component.css'],
})
export class GeneratorComponent implements OnInit {
    private simTypeDisp = '';
    private simulatedMon: SummMon = null;

    constructor(private monsterService: MonsterService, private router: Router) { };

    ngOnInit(): void {

    };

    private getMonsterClasses(mon: SummMon): string[] {
        return [`mon-type-${mon.type}`];
    };

    private simulateSummon(simType: string): void {
        this.monsterService.simulateSummon(simType).then((mon: SummMon) => {
            if (mon) {
                this.simulatedMon = mon;
                this.simTypeDisp = this.getSimTypeDisplay(simType);
            } else {
                this.simulatedMon = null;
                this.simTypeDisp = '';
                alert('Simulation was missing data, NO MON FOR YOU =[');
            }
        });
    };

    private getSimTypeDisplay(simType: string): string {
        let disp = '';

        switch (simType) {
            case 'legendary':
                disp = 'Legendary Scroll';
                break;
            case 'lightndark':
                disp = 'Light / Dark Scroll';
                break;
            case 'mystical':
            default:
                disp = 'Mystical Scroll';
                break;
        }

        return disp;
    };
};
