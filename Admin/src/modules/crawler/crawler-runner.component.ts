'use strict';

import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { Crawler } from '../../models/crawler';
import { SummMon } from '../../models/monster';

import { CrawlerService } from '../../services/crawler.service';
import { MonsterService } from '../../services/monster.service';

@Component({
    selector: 'app-crawler-runner',
    templateUrl: './crawler-runner.component.html',
    styleUrls: ['./crawler-runner.component.css'],
})
export class CrawlerRunnerComponent implements OnInit {
    @Input() crawler: Crawler;
    @ViewChild('runBtn') runBtn;

    private isRunning = false;
    private resultText = '';
    private resultHtml = '';

    constructor(
        private crawlerService: CrawlerService,
        private monsterService: MonsterService,
        private router: Router,
        private http: Http) {

    };

    ngOnInit(): void {

    };

    private toggleRunning(newVal: boolean): void {
        this.isRunning = newVal;

        // NOTE: use DOM Node API
        if (this.isRunning) {
            this.runBtn.nativeElement.setAttribute('disabled', 'disabled');
        } else {
            this.runBtn.nativeElement.removeAttribute('disabled');
        }
    };

    private runCrawler(): Promise<void> {
        if (this.isRunning) {
            return;
        }
        this.toggleRunning(true);

        this.crawlerService.runCrawler(this.crawler.id).then(result => {
            this.toggleRunning(false);

            this.resultText = result.resultText;
            this.resultHtml = result.resultHtml;
        });
    };

    private getMonsterClasses(mon: SummMon): string[] {
        return [`mon-type-${mon.type}`];
    };

    private getCrawlerUrl(crawler: Crawler): string {
        return crawler.url;
    };
};
