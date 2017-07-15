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

const API_ENDPOINT_SIMULATE: string = '';
const API_BASE: string = '';
const router = express.Router();

module.exports = (monsterMgr:MonsterManager) => {
    const convertBrotliBodyToHtml = (bodyBuffer: Buffer) => {
        console.info('[convertBrotliBodyToHtml] decoding brotli...');
        const intArr = brotli.decompress(bodyBuffer);
        let html = '';

        intArr.forEach((elem, ind, arr) => {
            html += String.fromCharCode(elem);
        });

        const $ = cheerio.load(unescape(html, null));

        return $;
    };

    const convertGzipBodyToHtml = (bodyBuffer: Buffer) => {
        console.info('[convertGzipBodyToHtml] decoding gzip...');
        const bodyText = zlib.gunzipSync(bodyBuffer, { }).toString('utf8');
        const $ = cheerio.load(unescape(bodyText, null));

        return $;
    };

    return router;
};
