'use strict';

import * as fs from 'file-system';
import * as path from 'path';
import * as async from 'async';
import * as brotli from 'brotli';
import * as cheerio from 'cheerio';
import * as express from 'express';
import * as request from 'request';
import * as zlib from 'zlib';
import * as unescape from 'unescape';

import { SummMon } from '../../models/monster';
import { Crawler } from '../../models/crawler';

export default class RequestManager {

    public static getSummCoOpts(url: string): any {
        return {
            method: 'GET',
            port: 8080,
            // NOTE: encoding=null ensures a buffer returns as the response
            encoding: null,
            headers: {
                'cache-control': 'no-cache',
                'authority': 'summonerswar.co',
                'referer': 'https://summonerswar.co/',
                'accept': 'text/plain, */*; q=0.01',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'user-agent': RequestManager.getUserAgent(),
                'accept-language': 'en-US,en;q=0.8',
                'x-requested-with': 'XMLHttpRequest',
                'accept-encoding': 'gzip, deflate, br',
                'origin': 'https://summonerswar.co',
            },
            uri: url,
        };
    };

    public static getUserAgent(): string {
        return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3137.0 Safari/537.36';
    }

    public static reqTo$(resp: any, bodyBuffer: Buffer): any {
        const acceptEncoding = String(resp.headers['accept-encoding']);
        const contentEncoding = String(resp.headers['content-encoding']);
        const xType = String(resp.headers['x-type']);
        const vary = String(resp.headers.vary);
        const canUseGzip = contentEncoding === 'gzip';
        const canUseBrotli = (acceptEncoding.indexOf('br') > -1) || (vary === 'Accept-Encoding' && xType === 'default');
        let $ = null;

        if (!canUseBrotli && !canUseGzip) {
            console.info('in weird state');
            return $;
        }
        if (canUseGzip) {
            $ = this.convertGzipBodyToHtml(bodyBuffer);
        } else if (canUseBrotli) {
            $ = this.convertBrotliBodyToHtml(bodyBuffer);
        }
        return $;
    }

    private static convertBrotliBodyToHtml(bodyBuffer): any {
        console.info('[convertBrotliBodyToHtml] decoding brotli...');
        const intArr = brotli.decompress(bodyBuffer);
        let html = '';

        intArr.forEach((elem, ind, arr) => {
            html += String.fromCharCode(elem);
        });

        const $ = cheerio.load(unescape(html, null));
        return $;
    };

    private static convertGzipBodyToHtml(bodyBuffer): any {
        console.info('[convertGzipBodyToHtml] decoding gzip...');
        const bodyText = zlib.gunzipSync(bodyBuffer, { }).toString('utf8');
        const $ = cheerio.load(unescape(bodyText, null));

        return $;
    };
};

export { RequestManager as RequestManager };
