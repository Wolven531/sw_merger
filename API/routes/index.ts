'use strict';

import * as express from 'express';

import { MonsterManager } from '../lib/managers/MonsterManager';
import { SummMon } from '../models/monster';

export default class HomeRouter {
    public router_express: any;

    private endpoints = [
        {
            path: '/monsters',
            method: 'get',
            description: 'Returns all monsters in a JSON array',
        },
        {
            path: '/monsters/:id',
            method: 'get',
            params: {
                id: {
                    type: 'number',
                },
            },
            description: 'Try to retrieve a monster by id; will 404 is id is not found',
        },
        {
            path: '/monsters/:id',
            method: 'put',
            params: {
                id: {
                    type: 'number',
                },
                body: {
                    type: 'SummMon',
                },
            },
            description: 'Try to update a monster by id; the payload (or body) of the put request should be the JSON serialized version of the updated monster',
        },
        {
            path: '/monsters/:id',
            method: 'delete',
            params: {
                id: {
                    type: 'number',
                },
            },
            description: 'Try to delete a monster by id',
        },
        {
            path: '/monsters/search',
            method: 'get',
            params: {
                name: {
                    type: 'string',
                },
                type: {
                    type: 'string',
                    possibleValues: SummMon.MONSTER_ELEMENT.asArray().join('|'),
                },
            },
            description: 'Try to search for a monster by its name and/or type. You can search by 1) just name 2) just type 3) name AND type (type is considered first)',
        },
        {
            path: '/generator/legendary',
            method: 'get',
            description: 'Simulate the results of a summon using a legendary scroll',
        },
        {
            path: '/generator/lightndark',
            method: 'get',
            description: 'Simulate the results of a summon using a light and dark scroll',
        },
        {
            path: '/generator/mystical',
            method: 'get',
            description: 'Simulate the results of a summon using a mystical scroll',
        },
        {
            path: '/crawler/',
            method: 'get',
            description: 'Get a list of all crawlers',
        },
        {
            path: '/crawler/:id',
            method: 'get',
            params: {
                id: {
                    type: 'number',
                },
            },
            description: 'Get the status of a crawler',
        },
    ];

    constructor(private monMgr:MonsterManager) {
        this.router_express = express.Router();
        this.router_express.get('/', this.handleHomePage.bind(this));
    }

    private handleHomePage(req, res, next): any {
        console.log('[handleHomePage]');

        const ngrokUrl = req.app.get('ngrokUrl') || '';
        const returnVal = {
            err: null,
            base: ngrokUrl,
            endpoints: this.endpoints,
        };

        // NOTE: awill: Learned about req.app.get from this stack overflow:
        // https://stackoverflow.com/a/18145714
        returnVal.endpoints = returnVal.endpoints.map((endpointObj: any, ind: number, arr: any[]): any => {
            endpointObj.example = `${ ngrokUrl }${ endpointObj.path }`;
            return endpointObj;
        });

        res.json(returnVal);
    };
}

export { HomeRouter };
