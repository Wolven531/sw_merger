'use strict';

import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SummMon } from '../../models/monster';

import { CrawlerService } from '../../services/crawler.service';
import { MonsterService } from '../../services/monster.service';

@Component({
    selector: 'crawler-root',
    templateUrl: './crawler.component.html',
    styleUrls: ['./crawler.component.css'],
})
export class CrawlerComponent implements OnInit {
    private crawlerStatus: string = '';

    constructor(
        private crawlerService: CrawlerService,
        private monsterService: MonsterService,
        private router: Router) {

    };

    ngOnInit(): void {

    };

    private startCrawler(): void {

    };

    private stopCrawler(): void {

    };

    private getMonsterClasses(mon: SummMon): string[] {
        return [`mon-type-${ mon.type }`];
    };

    private getSimTypeDisplay(simType: string): string {
        let disp: string = '';

        switch(simType) {
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
