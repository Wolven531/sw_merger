'use strict';

import * as fs from 'file-system';
import * as streamBuffers from 'stream-buffers';
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
    private static compName = '[CrawlerManager]';

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

    public static getSimRandomOpts(url: string): any {
        return {
            method: 'GET',
            json: true,
            headers: {
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'X-CSRF-Token': 'dmFPXLuems+XoeJWiMreQUlhJmtaeH7RTnklQ3u/1qbGTaKxgF5cgaRiIgkpNQVDzdxpHf/HGpIPzS1Cm3CaIw==',
                'User-Agent': RequestManager.getUserAgent(),
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'http://www.swfr.tv/summon-simulator',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.8',
                /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
            },
            uri: url,
        };
    }

    public static getSummCoSearchOpts(searchName: string): any {
        return {
            method: 'POST',
            uri: 'https://summonerswar.co/wp-content/plugins/ajax-search-pro/ajax_search.php',
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
            body: 'action=ajaxsearchpro_search&aspp='
                + searchName
                + '&asid=2&asp_inst_id=2_1&options=current_page_id%3D1816%26qtranslate_lang%3D0%26set_intitle%3DNone%26set_incontent%3DNone'
                + '%26customset%255B%255D%3Dpost%26customset%255B%255D%3Dpage%26termset%255Bcategory%255D%255B%255D%3D72%26termset%255B'
                + 'category%255D%255B%255D%3D80%26termset%255Bcategory%255D%255B%255D%3D74%26termset%255Bcategory%255D%255B%255D%3D76%26'
                + 'termset%255Bcategory%255D%255B%255D%3D75%26termset%255Bcategory%255D%255B%255D%3D93%26termset%255B'
                + 'category%255D%255B%255D%3D94%26termset%255Bcategory%255D%255B%255D%3D91%26termset%255Bcategory%255D%255B%255D%3D90',
        };
    };

    public static getUserAgent(): string {
        return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3137.0 Safari/537.36';
    }

    public static reqTo$(resp: any, bodyBuffer: Buffer): Promise<any> {
        const acceptEncoding = String(resp.headers['accept-encoding']);
        const contentEncoding = String(resp.headers['content-encoding']);
        const contentType = String(resp.headers['content-type']);
        const xType = String(resp.headers['x-type']);
        const vary = String(resp.headers.vary);
        const canUseGzip = contentEncoding === 'gzip';
        const canUseBrotli = (acceptEncoding.indexOf('br') > -1) || (vary === 'Accept-Encoding' && xType === 'default');

        console.info(`${ RequestManager.compName } [reqTo$]\n`
            + `\tcontentType=${ contentType }\n`
            + `\tacceptEncoding=${ acceptEncoding }\n`
            + `\tcontentEncoding=${ contentEncoding }\n`
            + `\txType=${ xType }\n`
            + `\tvary=${ vary }`
            // + `resp.headers=${JSON.stringify(resp.headers)}\n`
            // + `bodyBuffer=${ bodyBuffer }`
        );

        if (!canUseBrotli && !canUseGzip) {
            console.info(`${ RequestManager.compName } [reqTo$] in weird state, returning $ as null`);
            return Promise.resolve(null);
        }
        if (canUseGzip) {
            return this.convertGzipBodyToHtml(bodyBuffer);
        } else if (canUseBrotli) {
            return this.convertBrotliBodyToHtml(bodyBuffer);
        }
    }

    private static convertBrotliBodyToHtml(bodyBuffer: Buffer): Promise<any> {
        console.info(`${ RequestManager.compName} [convertBrotliBodyToHtml] decoding brotli...`);
        const intArr = brotli.decompress(bodyBuffer);
        let html = '';

        intArr.forEach((elem, ind, arr) => {
            html += String.fromCharCode(elem);
        });

        const $ = cheerio.load(unescape(html, null));
        return Promise.resolve($);
    };

    private static convertGzipBodyToHtml(bodyBuffer: Buffer): Promise<any> {
        if (!bodyBuffer) {
            console.warn(`${RequestManager.compName} [convertGzipBodyToHtml] bodyBuffer was null`);
            return Promise.resolve(null);
        }
        if (bodyBuffer.byteLength === undefined) {
            console.warn(`${RequestManager.compName} [convertGzipBodyToHtml] bodyBuffer.byteLength was undefined`);
            return Promise.resolve(null);
        }
        return new Promise((resolve, reject) => {
            console.info(`${RequestManager.compName} [convertGzipBodyToHtml] decoding gzip from ${bodyBuffer.byteLength} bytes...`);
            zlib.unzip(bodyBuffer, (err: Error, unzippedBuffer: Buffer) => {
                if (err) {
                    console.warn(`Error unzipping buffer: ${err}`);
                }
                const bodyText = unzippedBuffer.toString('utf8', 0, bodyBuffer.byteLength);
                const $ = cheerio.load(unescape(bodyText, null));
                resolve($);
            });
        });
    };
};

export { RequestManager as RequestManager };
