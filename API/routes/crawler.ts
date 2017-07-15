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
import { SummMon } from '../models/monster';

export default class CrawlerRouter {
    public router_express: any;

    // private API_ENDPOINT_SIMULATE: string = 'get_random';
    // private API_BASE: string = 'http://www.swfr.tv/simulator/';
    private SCROLL_TYPES = {
        Legendary: 0,
        LightAndDark: 1,
        Mystical: 2,
    };

    constructor(private monMgr: MonsterManager, private crawlerMgr: CrawlerManager) {
        this.router_express = express.Router();
        this.router_express.get('/', this.handleRoot.bind(this));
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

    private handleRoot(req, res, next): any {
        res.json({ success: true });
    };
}

export { CrawlerRouter };
