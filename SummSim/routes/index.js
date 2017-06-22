'use strict';

const async = require('async');
const brotli = require('brotli');
const cheerio = require('cheerio');
const express = require('express');
const request = require('request');
const rp = require('minimal-request-promise');
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

const convertBrotliBodyToHtml = function(bodyBuffer) {
    // NOTE: decode brotli algo
    const intArr = brotli.decompress(bodyBuffer);
    let html = '';

    intArr.forEach(function(elem, ind, arr) {
        html += String.fromCharCode(elem);
    });

    const $ = cheerio.load(unescape(html));

    return $;
};

const validateScrollType = function(scrollType) {
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
const generateSummonURL = function(scrollType) {
    if (!validateScrollType(scrollType)) {
        console.error('[index] [router] [generateSummonURL] invalid scrollType', {
            scrollType: JSON.stringify(scrollType),
        });
        return null;
    }
    return API_BASE + API_ENDPOINT_SIMULATE + '?type=' + scrollType;
};

const simLegendarySummon = function(cb) {
    const url = generateSummonURL(SCROLL_TYPES.Legendary);
    const lookupSim = function(asyncCb) {
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
            .then(function(resp) {
                const body = resp.body;
                const newMon = new SummMon(body);

                returnVal.urls.searchNameUsed = newMon.name;
                returnVal.monster = newMon;

                asyncCb(null, returnVal);
            })
            .catch(function(err) {
                returnVal.err = err;
                console.error('[lookupSim] some error...', { err: err });
                asyncCb(err);
            });
    };
    const lookupName = function(asyncCb) {
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

        console.info('Launching summ co request...');
        request(opts, function(error, response, bodyBuffer) {
            if (error) {
                console.error('[lookupName] Error:', error);
            }
            if (response.headers && 'br' === response.headers['content-encoding']) {
                const $ = convertBrotliBodyToHtml(bodyBuffer);
                const numLinks = $('a').length;
                const infoPageURL = $('a.asp_res_url').attr('href');

                returnVal.urls.numLinksOnSummCoPage = numLinks;
                returnVal.urls.infoPage = infoPageURL;
                optsSummCoInfoReq.uri = infoPageURL;
            }

            asyncCb(null, returnVal);
        });
    };
    const lookupInfo = function(asyncCb) {
        console.info('Launching summ co info request...');
        if ((typeof optsSummCoInfoReq.uri !== 'string')
            || (optsSummCoInfoReq.uri.length < 1)) {
            console.error('[lookupInfo] Failed to find URI...', {
                optsSummCoInfoReq: optsSummCoInfoReq,
            });
            asyncCb(null, returnVal);
            return;
        }

        request(optsSummCoInfoReq, function(error, response, bodyBuffer) {
            if (error) {
                console.error('[lookupInfo] Error:', error);
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

    console.info('[index] [router] [/] Starting async series...');
    async.series(reqOperations, function(err, results) {
        console.info(
            '[index] [router] [/] Finished all async, returning to client...'
        );
        cb(null, returnVal);
    });
};

// const simLightAndDarkSummon = function(cb) {
//     const url = generateSummonURL(SCROLL_TYPES.LightAndDark);
//     cb(null, { url: url });
// };

// const simMysticalSummon = function(cb) {
//     const url = generateSummonURL(SCROLL_TYPES.Mystical);
//     cb(null, { url: url });
// };

router.get('/', function(req, res, next) {
    let asyncFuncs = [];
    let returnVal = {
        err: null,
    };

    const genAsyncFunc = function() {
        return function(asyncCb) {
            simLegendarySummon(function(err, data) {
                returnVal.err = err;
                returnVal.data = data;
                asyncCb(err, data);
            });
        };
    };

    for (let i = 0; i < 1; i++) {
        asyncFuncs.push(genAsyncFunc());
    }

    async.series(asyncFuncs, function(err, monsterArr) {
        res.json(returnVal);
    });
    // simLightAndDarkSummon(processSummon);
    // simMysticalSummon(processSummon);
});

module.exports = router;
