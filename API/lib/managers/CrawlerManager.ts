'use strict';

import * as fs from 'file-system';
import * as moment from 'moment';
import * as path from 'path';

import { Crawler } from '../../models/crawler';

export default class CrawlerManager {
    private internalMap: any = {};
    private compName = '[CrawlerManager]';

    constructor() {
        this.internalMap = this.loadFromDisk();
    }

    public init(): void {
        console.info(`${this.compName} [init]`);
    };

    public getCrawler(id: number): Crawler {
        if (!id && (id !== 0)) {
            return null;
        }

        return this.internalMap[String(id)];
    };

    public addCrawler(newCrawler: Crawler): Crawler {
        // TODO: awill: add proper validation of monster here before adding

        const crawlKey = (!isNaN(newCrawler.id) && (newCrawler.id !== undefined)) ? String(newCrawler.id) : '';
        if (crawlKey.length < 1) {
            console.warn(`Could not add crawler, no ID in crawler. newCrawler.id=${newCrawler.id} newCrawler=${newCrawler}`);
            return null;
        }
        const existingCrawler = this.getCrawler(newCrawler.id);

        if (existingCrawler) {
            console.warn(`Attempted to add crawler that already exists (id=${existingCrawler.id}, name=${existingCrawler.name}). Bailing.`);
            return null;
        }

        this.internalMap[crawlKey] = newCrawler;

        console.info(`Added successfully with id: ${ crawlKey }; returning crawler...`);

        return this.internalMap[crawlKey];
    };

    public removeCrawler(id: number): Crawler {
        if (!id && (id !== 0)) {
            console.warn('Could not remove crawler, no ID provided.');
            return null;
        }

        const targetCrawler = this.getCrawler(id);

        if (!targetCrawler) {
            console.warn(`Could not remove crawler because it could not be found (id=${id}).`);
            return null;
        }

        delete this.internalMap[String(id)];
        targetCrawler.eraseFile();

        return targetCrawler;
    };

    public updateCrawler(id: number, updatedCrawler: Crawler = null): Crawler {
        if (!id && (id !== 0)) {
            console.warn('Could not update crawler, no ID provided.');
            return null;
        }
        if (!updatedCrawler) {
            console.warn('Could not remove crawler, no crawler provided.');
            return null;
        }

        const existingCrawler = this.getCrawler(id);
        const crawlKey = String(id);

        // NOTE: this forces any crawler that did not already exist to fail an update attempt
        if (!existingCrawler) {
            console.warn(`Could not update crawler because it could not be found (id=${id}).`);
            return null;
        }
        updatedCrawler._tsLastUpdate = moment.utc().valueOf();
        updatedCrawler.saveToFile({ force: true });
        this.internalMap[crawlKey] = updatedCrawler;

        return this.internalMap[crawlKey];
    };

    public getCrawlerArray(): Crawler[] {
        console.info(`${this.compName} [getCrawlerArray]`);
        const results = new Array<Crawler>();
        const keys = Object.keys(this.internalMap || {});

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
        console.info(`${this.compName} [getCrawlerMap] params: forceRefresh=${forceRefresh}`);
        // NOTE: this adds explicit type safety for the optional param
        forceRefresh = forceRefresh ? true : false;
        if (forceRefresh) {
            this.internalMap = {};
        }
        return this.internalMap;
    };

    private loadFromDisk(): any {
        console.info(`${this.compName} [loadFromDisk] About to load from disk...`);
        const CrawlerMap = {};
        let fp = '';
        let filename = '';
        let mapKey = '';
        let crawlerCount = 0;
        let data = null;
        let newObj: Crawler = null;
        const crawlerDir = path.resolve(`${__dirname}${path.sep}..${path.sep}..${path.sep}..${path.sep}crawlers${path.sep}`);

        fp = crawlerDir;

        if (!fs.fs.existsSync(fp)) {
            console.warn(`Crawler dir was missing: ${fp} | __dirname = ${__dirname}`);
            return;
        }

        const jsonFiles = fs.fs.readdirSync(fp).filter((currFileName, jsonInd, jsonArr) => {
            return path.extname(currFileName) === '.json';
        });

        console.info(`Dir ${fp} had ${jsonFiles.length} files`);
        for (let i = 0; i < jsonFiles.length; i++) {
            filename = jsonFiles[i];
            fp = path.resolve(`${crawlerDir}${path.sep}${filename}`);

            console.info(`About to read file, fp = ${fp}`);
            data = fs.fs.readFileSync(fp, { encoding: 'utf8', flag: 'r' });

            newObj = new Crawler(data);
            mapKey = String(newObj.id);

            CrawlerMap[mapKey] = newObj;
            crawlerCount++;
        }
        console.info(`Total crawler count: ${crawlerCount}`);

        return CrawlerMap;
    };
};

export { CrawlerManager as CrawlerManager };
