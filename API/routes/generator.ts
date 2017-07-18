'use strict';

import * as async from 'async';
import * as express from 'express';
import * as request from 'request';
import 'rxjs/add/operator/toPromise';

import { RequestManager } from '../lib/managers/RequestManager';
import { MonsterManager } from '../lib/managers/MonsterManager';
import { SummMon } from '../models/monster';

export default class GeneratorRouter {
    private static compName = '[GeneratorRouter]';

    public router_express: any;

    private API_ENDPOINT_SIMULATE = 'get_random';
    private API_BASE = 'http://www.swfr.tv/simulator/';
    private SCROLL_TYPES = {
        Legendary: 0,
        LightAndDark: 1,
        Mystical: 2,
    };

    constructor(private monMgr: MonsterManager) {
        this.router_express = express.Router();
        this.router_express.get('/legendary', this.handleGenerateLegendary.bind(this));
        this.router_express.get('/lightndark', this.handleGenerateLightNDark.bind(this));
        this.router_express.get('/mystical', this.handleGenerateMystical.bind(this));
    }

    private handleGenerateMystical(req, res, next): any {
        let returnVal = {
            data: null,
            err: null,
        };

        const url = this.generateSummonURL(this.SCROLL_TYPES.Mystical);
        console.info(`${ GeneratorRouter.compName } [handleGenerateMystical] Launching request at ${ url }`);
        this.simSummon(url)
            .then(updatedReturnVal => {
                returnVal = updatedReturnVal;

                res.json(returnVal);
            });
    };

    private handleGenerateLightNDark(req, res, next): any {
        let returnVal = {
            data: null,
            err: null,
        };

        const url = this.generateSummonURL(this.SCROLL_TYPES.LightAndDark);
        console.info(`${ GeneratorRouter.compName } [/lightndark] Launching request at ${ url }`);
        this.simSummon(url)
            .then(updatedReturnVal => {
                returnVal = updatedReturnVal;

                res.json(returnVal);
            });
    };

    private handleGenerateLegendary(req, res, next): any {
        let returnVal = {
            data: null,
            err: null,
        };

        const url = this.generateSummonURL(this.SCROLL_TYPES.Legendary);
        console.info(`${ GeneratorRouter.compName } [/legendary] Launching request at ${ url }`);
        this.simSummon(url)
            .then(updatedReturnVal => {
                returnVal = updatedReturnVal;

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

    /*
        // Legendary scroll:
        // http://www.swfr.tv/simulator/get_random?type=0
        //
        // Light and Darkness scroll:
        // http://www.swfr.tv/simulator/get_random?type=1
        //
        // Mystical scroll:
        // http://www.swfr.tv/simulator/get_random?type=2
    */
    private generateSummonURL(scrollType): string {
        if (!this.validateScrollType(scrollType)) {
            console.error(`[generator] [router] [generateSummonURL] invalid scrollType = ${ scrollType }`);
            return null;
        }
        return this.API_BASE + this.API_ENDPOINT_SIMULATE + '?type=' + scrollType;
    };

    private lookupSim(url: string, returnVal: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const simRandomOpts = RequestManager.getSimRandomOpts(url);

            console.info(`[lookupSim] Launching sim request at ${ simRandomOpts.uri  }`);
            request(simRandomOpts, (error, resp, bodyBuffer) => {
                const body = resp.body;
                const newMon = new SummMon(body);
                returnVal.urls.searchNameToUse = newMon.name;

                const newMonVerified = this.monMgr.addMonster(newMon);
                returnVal['monster'] = newMonVerified;

                if (newMonVerified) {
                    newMonVerified.saveToFile();
                } else {
                    returnVal.err = `Failed to add monster. Check monster data and server log. newMon=${ JSON.stringify(newMon) }`;
                }

                resolve(returnVal);
            })
        });
    };

    private lookupName(returnVal: any): Promise<any> {
        if (!returnVal.urls || !returnVal.urls.searchNameToUse) {
            console.warn(`[lookupName] Missing searchName, returnVal= ${ JSON.stringify(returnVal) }`);
            returnVal.err = 'missingSearchName';
            return Promise.resolve(returnVal);
        }
        return new Promise((resolve, reject) => {
            const searchOpts = RequestManager.getSummCoSearchOpts(returnVal.urls.searchNameToUse);

            console.info(`[lookupName] Launching summ co request at ${ searchOpts.uri }`);
            request(searchOpts, (error, resp, bodyBuffer: Buffer) => {
                if (error) {
                    console.error(`[lookupName] Error: ${ error }`);
                    returnVal.err = error;
                }
                RequestManager.reqTo$(resp, bodyBuffer).then($ => {
                    if (!$) {
                        returnVal.err += '\n$ was null...';
                        return resolve(returnVal);
                    }
                    const numLinks = $('a').length;
                    const infoPageURL = $('a.asp_res_url').attr('href');

                    console.info(`[lookupName] Setting URI for optsSummCoInfoReq: ${ infoPageURL }`);
                    returnVal.urls.numLinksOnSummCoPage = numLinks;
                    returnVal.urls.infoPage = infoPageURL;

                    if (!infoPageURL) {
                        console.warn(`[lookupName] infoPageURL was missing`);
                    }

                    resolve(returnVal);
                });
            });
        });
    };

    private lookupInfo(returnVal: any): Promise<any> {
        if (!returnVal.urls.infoPage) {
            console.error(`[lookupInfo] Failed to find URI... returnVal.urls=${ JSON.stringify(returnVal.urls) }`);
            return Promise.resolve(returnVal);
        }

        return new Promise((resolve, reject) => {
            const infoOpts = RequestManager.getSummCoOpts(returnVal.urls.infoPage);

            console.info(`[lookupInfo] Launching summ co info request at ${infoOpts.uri}`);
            request(infoOpts, (error, resp, bodyBuffer: Buffer) => {
                if (error) {
                    console.error(`[lookupInfo] Error: ${ error }`);
                    returnVal.err = error;
                }
                RequestManager.reqTo$(resp, bodyBuffer).then($ => {
                    if (!$) {
                        returnVal.err += '\n$ was null...';
                        return resolve(returnVal);
                    }
                    const htmlMeter = $('#rating-anchor .total-info .total-rating-value.large-meter');

                    returnVal.scores = {};
                    returnVal.scores.editor = htmlMeter
                        .find('.editor_rating .number')
                        .text();
                    returnVal.scores.user = htmlMeter.find('.user_rating .number').text();

                    resolve(returnVal);
                });
            });
        });
    };

    private async simSummon(url: string): Promise<any> {
        const returnVal = {
            urls: {
                simulation: url,
                searchNameToUse: '',
            },
            err: null,
        };
        return new Promise((resolve, reject) => {
            this.lookupSim(url, returnVal)
                .then(updatedReturn => {
                    return this.lookupName(updatedReturn);
                })
                .then(updatedReturn => {
                    return this.lookupInfo(updatedReturn);
                })
                .then(updatedReturn => {
                    resolve(updatedReturn);
                })
                .catch((reason: any) => {
                    returnVal.err = reason;

                    resolve(returnVal);
                });
        });
    };

    private async handleError(err: any): Promise<any> {
        return Promise.reject(err.message || err);
    }
}

export { GeneratorRouter as GeneratorRouter };
