'use strict';

import * as cheerio from 'cheerio';
import * as express from 'express';
import * as request from 'request';

import { RequestManager } from '../lib/managers/RequestManager';
import { MonsterManager } from '../lib/managers/MonsterManager';
import { CrawlerManager } from '../lib/managers/CrawlerManager';

import { Crawler } from '../models/crawler';
import { SummMon } from '../models/monster';

export default class CrawlerRouter {
    public router_express: any;

    constructor(private monMgr: MonsterManager, private crawlerMgr: CrawlerManager) {
        this.router_express = express.Router();

        this.router_express.delete('/:id', this.handleRemove.bind(this));
        this.router_express.post('/run/:id', this.handleRun.bind(this));
        this.router_express.post('/', this.handleAdd.bind(this));
        this.router_express.put('/:id', this.handleUpdate.bind(this));

        this.router_express.get('/:id', this.handleLookupById.bind(this));
        this.router_express.get('/', this.handleList.bind(this));
    }

    private handleLookupById(req, res, next): any {
        const id = parseInt(req.params.id, 10);
        console.info(`[crawler] [router] [GET] [/:id] id=${ id }`);
        const returnVal = {
            crawler: this.crawlerMgr.getCrawler(id),
            err: null,
        };

        res.json(returnVal);
    };

    // private async lookupSim(url: string, returnVal: any): Promise<any> {
    //     console.info('Launching sim request...');
    //     this.optsSimReq.uri = url;
    //     return request(this.optsSimReq, (error, resp, bodyBuffer) => {
    //         const body = resp.body;
    //         // NOTE: memOnly === false forces a save to disk
    //         const newMon = new SummMon(body, { memOnly: false });
    //         const newMonVerified = this.monMgr.addMonster(newMon);
    //         returnVal.urls.searchNameUsed = newMon.name;
    //         returnVal['monster'] = newMonVerified;

    //         if (!newMonVerified) {
    //             returnVal.err = `Failed to add monster. Check monster data and server log. newMon=${ JSON.stringify(newMon) }`;
    //         }

    //         return Promise.resolve(returnVal);
    //     });
    // };

    private handleRun(req, res, next): any {
        const id = parseInt(req.params.id, 10);
        console.info(`[crawler] [handleRun] id=${ id }`);
        const returnVal = {
            crawler: this.crawlerMgr.getCrawler(id),
            resultText: '',
            resultHtml: '',
            err: null,
        };
        if (!returnVal.crawler) {
            res.statusCode = 404;
            returnVal.err = 'noCrawlerData';
            return res.json(returnVal);
        }

        const opts = RequestManager.getSummCoOpts(returnVal.crawler.url);

        request(opts, (error, resp, bodyBuffer: Buffer) => {
            const $ = RequestManager.reqTo$(resp, bodyBuffer);

            returnVal.resultText = $(returnVal.crawler.domSelector).text();
            returnVal.resultHtml = $(returnVal.crawler.domSelector).html();
            returnVal.err = error;

            res.json(returnVal);
        });
    };

    private handleList(req, res, next): any {
        const returnVal = {
            crawlers: this.crawlerMgr.getCrawlerArray(),
            err: null,
        };

        res.json(returnVal);
    };

    private handleAdd(req, res, next): any {
        console.info(`[crawler] [handleAdd]`);
        const returnVal = {
            crawler: null,
            err: null,
        };
        const newCrawlerData = req.body || null;

        if (!newCrawlerData) {
            res.statusCode = 400;
            returnVal.err = 'noCrawlerData';
            return res.json(returnVal);
        }

        // NOTE: memOnly === false forces a save to disk
        const newCrawler = new Crawler(newCrawlerData, { memOnly: false });
        const resultOfAdd = this.crawlerMgr.addCrawler(newCrawler);

        if (!resultOfAdd) {
            res.statusCode = 400;
            returnVal.err = 'crawlerNotAdded';
            return res.json(returnVal);
        }

        returnVal.crawler = resultOfAdd;

        return res.json(returnVal);
    };

    private handleRemove(req, res, next): any {
        const id = parseInt(req.params.id, 10);
        console.info(`[crawler] [handleRemove] id=${ id }`);
        const returnVal = {
            removedCrawler: null,
            err: null,
        };
        const existingCrawler = this.crawlerMgr.getCrawler(id);

        if (!existingCrawler) {
            res.statusCode = 404;
            returnVal.err = 'noCrawlerData';
            return res.json(returnVal);
        }

        const resultOfRemove = this.crawlerMgr.removeCrawler(id);

        if (!resultOfRemove) {
            res.statusCode = 500;
            returnVal.err = 'crawlerNotRemoved';
            return res.json(returnVal);
        }

        returnVal.removedCrawler = resultOfRemove;

        return res.json(returnVal);
    };

    private handleUpdate(req, res, next): any {
        const id = parseInt(req.params.id, 10);
        console.info(`[crawler] [router] [PUT] [/:id] id=${ id }`);
        const returnVal = {
            staleCrawler: null,
            updatedCrawler: null,
            err: null,
        };
        const staleCrawler = this.crawlerMgr.getCrawler(id);
        const updatedCrawlerData = req.body || null;
        let resultOfUpdate = null;

        if (!staleCrawler) {
            res.statusCode = 404;
            returnVal.err = 'noCrawler';
            return res.json(returnVal);
        }
        if (!updatedCrawlerData) {
            res.statusCode = 400;
            returnVal.err = 'noCrawlerData';
            return res.json(returnVal);
        }

        resultOfUpdate = this.crawlerMgr.updateCrawler(
            staleCrawler.id,
            updatedCrawlerData
        );

        if (!resultOfUpdate) {
            res.statusCode = 500;
            returnVal.err = 'crawlerNotUpdated';
            return res.json(returnVal);
        }

        returnVal.updatedCrawler = resultOfUpdate;

        return res.json(returnVal);
    };
}

export { CrawlerRouter as CrawlerRouter };
