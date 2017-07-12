'use strict';

const async = require('async');
const brotli = require('brotli');
const cheerio = require('cheerio');
const express = require('express');
const request = require('request');
const rp = require('minimal-request-promise');
const zlib = require('zlib');
const unescape = require('unescape');

const SummMon = require('../models/monster');

const router = express.Router();

const API_ENDPOINT_SIMULATE = 'get_random';
const API_BASE = 'http://www.swfr.tv/simulator/';
const SCROLL_TYPES = {
    Legendary: 0,
    LightAndDark: 1,
    Mystical: 2,
};

module.exports = function(monsterMgr) {
    const convertBrotliBodyToHtml = (bodyBuffer) => {
        console.info('[convertBrotliBodyToHtml] decoding brotli...');
        const intArr = brotli.decompress(bodyBuffer);
        let html = '';

        intArr.forEach((elem, ind, arr) => {
            html += String.fromCharCode(elem);
        });

        const $ = cheerio.load(unescape(html));

        return $;
    };

    const convertGzipBodyToHtml = (bodyBuffer) => {
        console.info('[convertGzipBodyToHtml] decoding gzip...');
        const bodyText = zlib.gunzipSync(bodyBuffer, { }).toString('utf8');
        const $ = cheerio.load(unescape(bodyText));

        return $;
    };

    const validateScrollType = (scrollType) => {
        if (typeof scrollType === 'undefined' || scrollType === null) {
            return false;
        }
        // NOTE: treat scrollType as a number
        if (!isNaN(scrollType)) {
            const keys = Object.keys(SCROLL_TYPES);
            let currKey = null;
            let found = false;

            for (let i = 0; i < keys.length; i++) {
                currKey = keys[i];

                if (SCROLL_TYPES[currKey] === scrollType) {
                    found = true;
                    break;
                }
            }

            return found;
        }
        return false;
    };

    //
    // Legendary scroll:
    // http://www.swfr.tv/simulator/get_random?type=0
    //
    // Light and Darkness scroll:
    // http://www.swfr.tv/simulator/get_random?type=1
    //
    // Mystical scroll:
    // http://www.swfr.tv/simulator/get_random?type=2
    //
    const generateSummonURL = (scrollType) => {
        if (!validateScrollType(scrollType)) {
            console.error(`[generator] [router] [generateSummonURL] invalid scrollType = ${ scrollType }`);
            return null;
        }
        return API_BASE + API_ENDPOINT_SIMULATE + '?type=' + scrollType;
    };

    const simSummon = (url, cb) => {
        const lookupSim = (asyncCb) => {
            const optsSimReq = {
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
            };

            console.info('Launching sim request...');
            rp
                .get(url, optsSimReq)
                .then((resp) => {
                    const body = resp.body;
                    // NOTE: memOnly === false forces a save to disk
                    const newMon = new SummMon(body, { memOnly: false });
                    const newMonVerified = monsterMgr.addMonster(newMon);
                    returnVal.urls.searchNameUsed = newMon.name;
                    returnVal.monster = newMonVerified;

                    if (!newMonVerified) {
                        returnVal.err = `Failed to add monster. Check monster data and server log. newMon=${ JSON.stringify(newMon) }`;
                    }

                    asyncCb(null, returnVal);
                })
                .catch((err) => {
                    returnVal.err = err;
                    console.error(`[lookupSim] some error... err=${ err }`);
                    asyncCb(err);
                });
        };
        const lookupName = (asyncCb) => {
            const opts = {
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
                body: 'action=ajaxsearchpro_search&aspp=' +
            returnVal.urls.searchNameUsed +
            '&asid=2&asp_inst_id=2_1&options=current_page_id%3D1816%26qtranslate_lang%3D0%26set_intitle%3DNone%26set_incontent%3DNone%26customset%255B%255D%3Dpost%26customset%255B%255D%3Dpage%26termset%255Bcategory%255D%255B%255D%3D72%26termset%255Bcategory%255D%255B%255D%3D80%26termset%255Bcategory%255D%255B%255D%3D74%26termset%255Bcategory%255D%255B%255D%3D76%26termset%255Bcategory%255D%255B%255D%3D75%26termset%255Bcategory%255D%255B%255D%3D93%26termset%255Bcategory%255D%255B%255D%3D94%26termset%255Bcategory%255D%255B%255D%3D91%26termset%255Bcategory%255D%255B%255D%3D90',
            };

            console.info('[lookupName] Launching summ co request...');
            request(opts, (error, response, bodyBuffer) => {
                if (error) {
                    console.error(`[lookupName] Error: ${ error }`);
                }
                const acceptEncoding = String(response.headers['accept-encoding']);
                const contentEncoding = String(response.headers['content-encoding']);
                const xType = String(response.headers['x-type']);
                const vary = String(response.headers.vary);
                const canUseGzip = contentEncoding === 'gzip';
                const canUseBrotli = (acceptEncoding.indexOf('br') > -1) || (vary === 'Accept-Encoding' && xType === 'default');

                if (!canUseBrotli && !canUseGzip) {
                    console.info('[lookupName] in weird state');
                    asyncCb(null, returnVal);
                    return;
                }

                let $ = null;

                if (canUseGzip) {
                    $ = convertGzipBodyToHtml(bodyBuffer);
                } else if (canUseBrotli) {
                    $ = convertBrotliBodyToHtml(bodyBuffer);
                }

                const numLinks = $('a').length;
                const infoPageURL = $('a.asp_res_url').attr('href');

                returnVal.urls.numLinksOnSummCoPage = numLinks;
                returnVal.urls.infoPage = infoPageURL;
                console.info(`[lookupName] Setting URI for optsSummCoInfoReq: ${ infoPageURL }`);
                optsSummCoInfoReq.uri = infoPageURL;

                asyncCb(null, returnVal);
            });
        };
        const lookupInfo = (asyncCb) => {
            console.info('Launching summ co info request...');
            if ((typeof optsSummCoInfoReq.uri !== 'string')
                || (optsSummCoInfoReq.uri.length < 1)) {
                console.error(`[lookupInfo] Failed to find URI... optsSummCoInfoReq = ${ JSON.stringify(optsSummCoInfoReq) }`);
                asyncCb(null, returnVal);
                return;
            }

            request(optsSummCoInfoReq, (error, response, bodyBuffer) => {
                if (error) {
                    console.error(`[lookupInfo] Error: ${ error }`);
                }
                if (response.headers && ('br' === response.headers['content-encoding'])) {
                    const $ = convertBrotliBodyToHtml(bodyBuffer);
                    const htmlMeter = $(
                        '#rating-anchor .total-info .total-rating-value.large-meter'
                    );

                    returnVal.scores = {};
                    returnVal.scores.editor = htmlMeter
                        .find('.editor_rating .number')
                        .text();
                    returnVal.scores.user = htmlMeter.find('.user_rating .number').text();
                }

                asyncCb(null, returnVal);
            });
        };
        const reqOperations = [lookupSim, lookupName, lookupInfo];

        let returnVal = {
            urls: {
                simulation: url,
            },
        };
        let optsSummCoInfoReq = {
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

        console.info('[generator] [router] Starting async series...');
        async.series(reqOperations, (err, results) => {
            console.info('[generator] [router] Finished all async, returning to client...');
            cb(null, returnVal);
        });
    };

    router.get('/legendary', (req, res, next) => {
        console.info('[generator] [router] [/legendary] Launching request...');
        let asyncFuncs = [];
        let returnVal = {
            err: null,
        };

        const genAsyncFunc = () => {
            const url = generateSummonURL(SCROLL_TYPES.Legendary);
            return (asyncCb) => {
                simSummon(url, (err, data) => {
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
    });

    router.get('/lightndark', (req, res, next) => {
        console.info('[generator] [router] [/lightndark] Launching request...');
        let asyncFuncs = [];
        let returnVal = {
            err: null,
        };

        const genAsyncFunc = () => {
            const url = generateSummonURL(SCROLL_TYPES.LightAndDark);
            return (asyncCb) => {
                simSummon(url, (err, data) => {
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
    });

    router.get('/mystical', (req, res, next) => {
        console.info('[generator] [router] [/mystical] Launching request...');
        let asyncFuncs = [];
        let returnVal = {
            err: null,
        };

        const genAsyncFunc = () => {
            const url = generateSummonURL(SCROLL_TYPES.Mystical);
            return (asyncCb) => {
                simSummon(url, (err, data) => {
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
    });

    return router;
};
