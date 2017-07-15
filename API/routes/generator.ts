'use strict';

import * as async from 'async';
import * as brotli from 'brotli';
import * as cheerio from 'cheerio';
import * as express from 'express';
import * as request from 'request';
import * as zlib from 'zlib';
import * as unescape from 'unescape';

import { MonsterManager } from '../lib/managers/MonsterManager';
import { SummMon } from '../models/monster';

export default class GeneratorRouter {
    public router: any;
    private mgr: MonsterManager;
    private API_ENDPOINT_SIMULATE: string = 'get_random';
    private API_BASE: string = 'http://www.swfr.tv/simulator/';
    private SCROLL_TYPES = {
        Legendary: 0,
        LightAndDark: 1,
        Mystical: 2,
    };

    private optsSimReq = {
        method: 'GET',
        json: true,
        headers: {
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'X-CSRF-Token': 'dmFPXLuems+XoeJWiMreQUlhJmtaeH7RTnklQ3u/1qbGTaKxgF5cgaRiIgkpNQVDzdxpHf/HGpIPzS1Cm3CaIw==',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3137.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'http://www.swfr.tv/summon-simulator',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.8',
            /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
        },
        uri: undefined,
    };

    private optsSummCoInfoReq = {
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
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3137.0 Safari/537.36',
            'accept-language': 'en-US,en;q=0.8',
            'x-requested-with': 'XMLHttpRequest',
            'accept-encoding': 'gzip, deflate, br',
            'origin': 'https://summonerswar.co',
        },
    };

    private opts = {
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
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3137.0 Safari/537.36',
            'accept-language': 'en-US,en;q=0.8',
            'x-requested-with': 'XMLHttpRequest',
            'accept-encoding': 'gzip, deflate, br',
            'origin': 'https://summonerswar.co',
        },
        body: null,
    };

    constructor(private monMgr:MonsterManager) {
        this.mgr = monMgr;
        this.router = express.Router();
        this.router.get('/legendary', this.handleGenerateLegendary);
        this.router.get('/lightndark', this.handleGenerateLightNDark);
        this.router.get('/mystical', this.handleGenerateMystical);
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
        const bodyText = zlib.gunzipSync(bodyBuffer, { }).toString('utf8');
        const $ = cheerio.load(unescape(bodyText, null));

        return $;
    };

    private handleGenerateMystical(req, res, next): any {
        console.info('[generator] [router] [/mystical] Launching request...');
        let asyncFuncs = [];
        let returnVal = {
            data: null,
            err: null,
        };

        const genAsyncFunc = () => {
            const url = this.generateSummonURL(this.SCROLL_TYPES.Mystical);
            return (asyncCb) => {
                this.simSummon(url, (err, data) => {
                    returnVal.err = err;
                    returnVal.data = data;
                    asyncCb(err, data);
                });
            };
        };

        for (let i = 0; i < 1; i++) {
            asyncFuncs.push(genAsyncFunc());
        }

        async.series(asyncFuncs, (err, monsterArr) => {
            res.json(returnVal);
        });
    };

    private handleGenerateLightNDark(req, res, next): any {
        console.info('[generator] [router] [/lightndark] Launching request...');
        let asyncFuncs = [];
        let returnVal = {
            data: null,
            err: null,
        };

        const genAsyncFunc = () => {
            const url = this.generateSummonURL(this.SCROLL_TYPES.LightAndDark);
            return (asyncCb) => {
                this.simSummon(url, (err, data) => {
                    returnVal.err = err;
                    returnVal.data = data;
                    asyncCb(err, data);
                });
            };
        };

        for (let i = 0; i < 1; i++) {
            asyncFuncs.push(genAsyncFunc());
        }

        async.series(asyncFuncs, (err, monsterArr) => {
            res.json(returnVal);
        });
    };

    private handleGenerateLegendary(req, res, next): any {
        console.info('[generator] [router] [/legendary] Launching request...');
        let asyncFuncs = [];
        let returnVal = {
            data: null,
            err: null,
        };

        const genAsyncFunc = () => {
            const url = this.generateSummonURL(this.SCROLL_TYPES.Legendary);
            return (asyncCb) => {
                this.simSummon(url, (err, data) => {
                    returnVal.err = err;
                    returnVal.data = data;
                    asyncCb(err, data);
                });
            };
        };

        for (let i = 0; i < 1; i++) {
            asyncFuncs.push(genAsyncFunc());
        }

        async.series(asyncFuncs, (err, monsterArr) => {
            res.json(returnVal);
        });
    };

    private validateScrollType(scrollType: any): boolean {
        if ((typeof scrollType === 'undefined') || (scrollType === null)) {
            return false;
        }
        // NOTE: treat scrollType as a number
        if (!isNaN(scrollType)) {
            const keys = Object.keys(this.SCROLL_TYPES);
            let currKey = null;
            let found = false;

            for (let i = 0; i < keys.length; i++) {
                currKey = keys[i];

                if (this.SCROLL_TYPES[currKey] === scrollType) {
                    found = true;
                    break;
                }
            }

            return found;
        }
        return false;
    };

    // Legendary scroll:
    // http://www.swfr.tv/simulator/get_random?type=0
    //
    // Light and Darkness scroll:
    // http://www.swfr.tv/simulator/get_random?type=1
    //
    // Mystical scroll:
    // http://www.swfr.tv/simulator/get_random?type=2
    private generateSummonURL(scrollType): string {
        if (!this.validateScrollType(scrollType)) {
            console.error(`[generator] [router] [generateSummonURL] invalid scrollType = ${ scrollType }`);
            return null;
        }
        return this.API_BASE + this.API_ENDPOINT_SIMULATE + '?type=' + scrollType;
    };

    private async lookupSim(url:string, returnVal: any): Promise<any> {
        console.info('Launching sim request...');
        this.optsSimReq.uri = url;
        return request(this.optsSimReq, (error, resp, bodyBuffer) => {
            const body = resp.body;
            // NOTE: memOnly === false forces a save to disk
            const newMon = new SummMon(body, { memOnly: false });
            const newMonVerified = this.mgr.addMonster(newMon);
            returnVal.urls.searchNameUsed = newMon.name;
            returnVal['monster'] = newMonVerified;

            if (!newMonVerified) {
                returnVal.err = `Failed to add monster. Check monster data and server log. newMon=${ JSON.stringify(newMon) }`;
            }

            return Promise.resolve(returnVal);
        });
    };
    
    private async lookupName(returnVal: any): Promise<any> {
        console.info('[lookupName] Launching summ co request...');
        this.opts.body = 'action=ajaxsearchpro_search&aspp='
            + returnVal.urls.searchNameUsed
            + '&asid=2&asp_inst_id=2_1&options=current_page_id%3D1816%26qtranslate_lang%3D0%26set_intitle%3DNone%26set_incontent%3DNone%26customset%255B%255D%3Dpost%26customset%255B%255D%3Dpage%26termset%255Bcategory%255D%255B%255D%3D72%26termset%255Bcategory%255D%255B%255D%3D80%26termset%255Bcategory%255D%255B%255D%3D74%26termset%255Bcategory%255D%255B%255D%3D76%26termset%255Bcategory%255D%255B%255D%3D75%26termset%255Bcategory%255D%255B%255D%3D93%26termset%255Bcategory%255D%255B%255D%3D94%26termset%255Bcategory%255D%255B%255D%3D91%26termset%255Bcategory%255D%255B%255D%3D90';
        return request(this.opts, (error, resp, bodyBuffer:Buffer) => {
            if (error) {
                console.error(`[lookupName] Error: ${ error }`);
            }
            const acceptEncoding = String(resp.headers['accept-encoding']);
            const contentEncoding = String(resp.headers['content-encoding']);
            const xType = String(resp.headers['x-type']);
            const vary = String(resp.headers.vary);
            const canUseGzip = contentEncoding === 'gzip';
            const canUseBrotli = (acceptEncoding.indexOf('br') > -1) || (vary === 'Accept-Encoding' && xType === 'default');

            if (!canUseBrotli && !canUseGzip) {
                console.info('[lookupName] in weird state');
                return Promise.resolve(returnVal);
            }

            let $ = null;

            if (canUseGzip) {
                $ = this.convertGzipBodyToHtml(bodyBuffer);
            } else if (canUseBrotli) {
                $ = this.convertBrotliBodyToHtml(bodyBuffer);
            }

            const numLinks = $('a').length;
            const infoPageURL = $('a.asp_res_url').attr('href');

            returnVal.urls.numLinksOnSummCoPage = numLinks;
            returnVal.urls.infoPage = infoPageURL;
            console.info(`[lookupName] Setting URI for optsSummCoInfoReq: ${ infoPageURL }`);
            this.optsSimReq.uri = infoPageURL;

            return Promise.resolve(returnVal);
        });
    };

    private async lookupInfo(returnVal: any): Promise<any> {
        console.info('Launching summ co info request...');
        if (!this.optsSimReq.uri || (this.optsSimReq.uri.length < 1)) {
            console.error(`[lookupInfo] Failed to find URI... optsSummCoInfoReq = ${ JSON.stringify(this.optsSummCoInfoReq) }`);
            return Promise.resolve(returnVal);
        }

        return request(this.optsSimReq, (error, response, bodyBuffer: Buffer) => {
            if (error) {
                console.error(`[lookupInfo] Error: ${ error }`);
            }
            if (response.headers && ('br' === response.headers['content-encoding'])) {
                const $ = this.convertBrotliBodyToHtml(bodyBuffer);
                const htmlMeter = $(
                    '#rating-anchor .total-info .total-rating-value.large-meter'
                );

                returnVal.scores = {};
                returnVal.scores.editor = htmlMeter
                    .find('.editor_rating .number')
                    .text();
                returnVal.scores.user = htmlMeter.find('.user_rating .number').text();
            }

            return Promise.resolve(returnVal);
        });
    };

    private async simSummon(url: string, cb): Promise<any> {
        let returnVal = {
            urls: {
                simulation: url,
            },
        };
        console.info('[generator] [router] Starting async series...');

        returnVal = await this.lookupSim(url, returnVal);
        returnVal = await this.lookupName(returnVal);
        returnVal = await this.lookupInfo(returnVal);

        console.info('[generator] [router] Finished all async, returning to client...');
        return returnVal;
    };
}

export { GeneratorRouter };
