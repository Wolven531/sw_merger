'use strict';

import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
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
    @ViewChild('addBtn') addBtn;
    @ViewChild('newCrawlerNameInput') newCrawlerNameInput;
    @ViewChild('newCrawlerUrlInput') newCrawlerUrlInput;
    @ViewChild('newCrawlerDomSelectorInput') newCrawlerDomSelectorInput;

    private crawlers: Crawler[] = new Array<Crawler>();
    private newCrawlerName = '';
    private newCrawlerUrl = '';
    private newCrawlerDomSelector = '';
    private crawlerMapping = {
        '=0': 'No (0) crawlers',
        '=1': 'One (1) crawler',
        'other': '# crawlers'
    };
    private editCrawl = -1;
    private editMode = '';

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

    private updateCrawler(updatedCrawler: Crawler): void {
        this.crawlerService.updateCrawler(updatedCrawler).then(respCrawler => {
            this.crawlers.forEach((curr, ind, arr) => {
                if (curr.id === respCrawler.id) {
                    this.crawlers[ind] = respCrawler;
                }
            });
            this.toggleEditMode(this.editCrawl, '');
        })
    }

    private toggleEditMode(id: number, prop: string): void {
        if (this.editCrawl !== id) {
            this.editCrawl = id;
            this.editMode = prop;
        } else {
            this.editCrawl = -1;
            this.editMode = '';
        }

    }

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

    private validateNewCrawler(): void {
        const webReg = new RegExp(/^www\..+\.(com|net|org).*$/gi);
        let remainDisabled = true;

        if (!this.newCrawlerUrl || (this.newCrawlerUrl.length < 3)) {
        // } else if (!webReg.test(this.newCrawlerUrl)) {
        } else if (!this.newCrawlerName || (this.newCrawlerName.length < 3)) {
        } else if (!this.newCrawlerDomSelector || (this.newCrawlerDomSelector.length < 1)) {
        } else {
            remainDisabled = false;
        }

        // NOTE: use DOM Node API
        if (remainDisabled) {
            this.addBtn.nativeElement.setAttribute('disabled', 'disabled');
        } else {
            this.addBtn.nativeElement.removeAttribute('disabled');
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
