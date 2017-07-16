'use strict';

import * as fs from 'file-system';
import * as path from 'path';

import { Crawler } from '../../models/crawler';

export default class CrawlerManager {
    private internalMap: any = { };
    private compName: string = '[CrawlerManager]';

    constructor() {
        console.info(`${ this.compName } [constructor]`);
        
    }

    public init (): void {
        console.info(`${ this.compName } [init]`);
    };

    public getCrawler(id:number): Crawler {
        if (!id) {
            return null;
        }

        return this.internalMap[String(id)];
    };

    public addCrawler(newCrawler: Crawler): Crawler {
        // TODO: awill: add proper validation of monster here before adding

        if (String(newCrawler.id).length < 1) {
            console.warn(`Could not add crawler, no ID in crawler. newCrawler.id=${ newCrawler.id } newCrawler=${ newCrawler }`);
            return null;
        }
        const existingCrawler = this.getCrawler(newCrawler.id);

        if (existingCrawler) {
            console.warn(`Attempted to add crawler that already exists (id=${ existingCrawler.id }, name=${ existingCrawler.name }). Bailing.`);
            return null;
        }

        this.internalMap[newCrawler.id] = newCrawler;

        return this.internalMap[newCrawler.id];
    };

    public removeCrawler(id:number): Crawler {
        if (!id) {
            console.warn('Could not remove crawler, no ID provided.');
            return null;
        }

        const targetCrawler = this.getCrawler(id);

        if (!targetCrawler) {
            console.warn(`Could not remove crawler because it could not be found (id=${ id }).`);
            return null;
        }

        delete this.internalMap[String(id)];
        return targetCrawler;
    };

    public updateCrawler(id: number, crawler: Crawler = null): Crawler {
        if (!id) {
            console.warn('Could not update crawler, no ID provided.');
            return null;
        }
        if (!crawler) {
            console.warn('Could not remove crawler, no crawler provided.');
            return null;
        }

        const existingCrawler = this.getCrawler(id);
        const crawlKey = String(id);

        // NOTE: this forces any crwaler that did not already exist to fail an update attempt
        if (!existingCrawler) {
            console.warn(`Could not update crawler because it could not be found (id=${ id }).`);
            return null;
        }
        this.internalMap[crawlKey] = crawler;

        return this.internalMap[crawlKey];
    };

    public getCrawlerArray(): Crawler[] {
        console.info(`${ this.compName } [getCrawlerArray]`);
        let results = new Array<Crawler>();
        let keys = Object.keys(this.internalMap || {});

        // NOTE: each validation case is handled separately for explicity
        if (!this.internalMap) {
            return results;
        }
        if (keys.length < 1) {
            return results;
        }

        for (let i = 0; i < keys.length; i++) {
            results.push(this.internalMap[keys[i]]);
        }
        return results;
    };

    private getCrawlerMap(forceRefresh: boolean): any {
        console.info(`${ this.compName } [getCrawlerMap] params: forceRefresh=${ forceRefresh }`);
        // NOTE: this adds explicit type safety for the optional param
        forceRefresh = forceRefresh ? true : false;
        if (forceRefresh) {
            this.internalMap = {};
        }
        return this.internalMap;
    };
};

export { CrawlerManager as CrawlerManager };
