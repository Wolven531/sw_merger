'use strict';

import * as async from 'async';
import * as brotli from 'brotli';
import * as cheerio from 'cheerio';
import * as express from 'express';
import * as request from 'request';
import * as zlib from 'zlib';
import * as unescape from 'unescape';

import { MonsterManager } from '../lib/managers/MonsterManager';
import { CrawlerManager } from '../lib/managers/CrawlerManager';

import { Crawler } from '../models/crawler';
import { SummMon } from '../models/monster';

export default class CrawlerRouter {
    public router_express: any;

    constructor(private monMgr: MonsterManager, private crawlerMgr: CrawlerManager) {
        this.router_express = express.Router();

        this.router_express.delete('/:id', this.handleRemove.bind(this));
        this.router_express.post('/', this.handleAdd.bind(this));
        this.router_express.put('/:id', this.handleUpdate.bind(this));

        this.router_express.get('/:id', this.handleLookupById.bind(this));
        this.router_express.get('/', this.handleList.bind(this));
    }

    private convertBrotliBodyToHtml(bodyBuffer): any {
        console.info('[convertBrotliBodyToHtml] decoding brotli...');
        const intArr = brotli.decompress(bodyBuffer);
        let html = '';

        intArr.forEach((elem, ind, arr) => {
            html += String.fromCharCode(elem);
        });

        const $ = cheerio.load(unescape(html, null));
        return $;
    };

    private convertGzipBodyToHtml(bodyBuffer): any {
        console.info('[convertGzipBodyToHtml] decoding gzip...');
        const bodyText = zlib.gunzipSync(bodyBuffer, {}).toString('utf8');
        const $ = cheerio.load(unescape(bodyText, null));

        return $;
    };

    private handleLookupById(req, res, next): any {
        const id = parseInt(req.params.id, 10);
        console.info(`[crawler] [router] [GET] [/:id] id=${ id }`);
        const returnVal = {
            crawler: this.crawlerMgr.getCrawler(id),
            err: null,
        };

        res.json(returnVal);
    };

    private handleList(req, res, next): any {
        const returnVal = {
            crawlers: this.crawlerMgr.getCrawlerArray(),
            err: null,
        }

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

        const newCrawler = new Crawler(newCrawlerData);
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
