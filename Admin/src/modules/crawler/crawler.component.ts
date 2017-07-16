'use strict';

import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Crawler } from '../../models/crawler';
import { SummMon } from '../../models/monster';

import { CrawlerService } from '../../services/crawler.service';
import { MonsterService } from '../../services/monster.service';

@Component({
    selector: 'app-crawler',
    templateUrl: './crawler.component.html',
    styleUrls: ['./crawler.component.css'],
})
export class CrawlerComponent implements OnInit {
    private crawlers: Crawler[] = new Array<Crawler>();
    private newCrawlerName = '';
    private newCrawlerUrl = '';
    private newCrawlerDomSelector = '';
    private crawlerMapping = {
        '=0': 'No (0) crawlers',
        '=1': 'One (1) crawler',
        'other': '# crawlers'
    };

    constructor(
        private crawlerService: CrawlerService,
        private monsterService: MonsterService,
        private router: Router) {

    };

    ngOnInit(): void {
        this.crawlerService.getCrawlers().then(crawlers => {
            this.crawlers = crawlers;
        });
    };

    private addCrawler(): void {
        const newCrawlerData = {
            name: this.newCrawlerName,
            url: this.newCrawlerUrl,
            domSelector: this.newCrawlerDomSelector,
        };
        const newCrawler = new Crawler(newCrawlerData);
        this.crawlerService.addCrawler(newCrawler).then(updatedCrawler => {
            this.crawlers.push(updatedCrawler);
            this.newCrawlerName = '';
            this.newCrawlerUrl = '';
            this.newCrawlerDomSelector = '';
        });
    };

    private onDelete(targetCrawler: Crawler, evt: Event): void {
        evt.stopPropagation();

        if (confirm(`Delete ID ${ targetCrawler.id } ?`) && confirm('Are you sure?')) {
            this.crawlerService
                .removeCrawler(targetCrawler.id)
                .then(() => {
                    this.crawlers = this.crawlers.filter((curr, ind, arr) => {
                        return curr !== targetCrawler;
                    });
                });
        }
    };

    private startCrawler(): void {

    };

    private stopCrawler(): void {

    };

    private getMonsterClasses(mon: SummMon): string[] {
        return [`mon-type-${mon.type}`];
    };

    private getCrawlerUrl(crawler: Crawler): string {
        return crawler.url;
    };
};
