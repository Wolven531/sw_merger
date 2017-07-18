'use strict';

import * as express from 'express';

import { MonsterManager } from '../lib/managers/MonsterManager';
import { SummMon } from '../models/monster';

export default class MonsterRouter {
    public router_express: any;

    constructor(private monMgr: MonsterManager) {
        this.router_express = express.Router();

        this.router_express.delete(['/:mon_id'], this.handleDelete.bind(this));
        this.router_express.put(['/:mon_id'], this.handleUpdate.bind(this));
        // NOTE: this endpoint comes first for specificity
        this.router_express.get(['/search'], this.handleSearch.bind(this));
        // NOTE: this endpoint comes second
        this.router_express.get(['/:mon_id'], this.handleLookupById.bind(this));
        this.router_express.get(['/'], this.handleList.bind(this));
    }

    private handleDelete(req, res, next): any {
        const monId = parseInt(req.params.mon_id, 10);
        console.info(`[monsters] [router] [DELETE] [/:mon_id] mon_id=${ monId }`);
        const returnVal = {
            staleMonster: null,
            err: null,
        };
        const staleMonster = this.monMgr.getMonster(monId);

        if (!staleMonster) {
            res.statusCode = 404;
            returnVal.err = 'noMonster';
            return res.json(returnVal);
        }

        // TODO: awill: Make this remove asynchronous

        this.monMgr.removeMonster(staleMonster.id);

        return res.json(returnVal);
    };

    private handleUpdate(req, res, next): any {
        const id = parseInt(req.params.mon_id, 10);
        const updatedMonData = req.body || null;
        console.info(`[monsters] [router] [PUT] [/:mon_id] id=${ id } updatedMonData=${ updatedMonData }`);
        const returnVal = {
            staleMonster: this.monMgr.getMonster(id),
            updatedMonster: null,
            err: null,
        };
        if (!updatedMonData) {
            res.statusCode = 400;
            returnVal.err = 'noMonsterData';
            return res.json(returnVal);
        }
        if (!returnVal.staleMonster) {
            res.statusCode = 404;
            returnVal.err = 'noMonster';
            return res.json(returnVal);
        }

        // TODO: awill: Add a data validation call here before directly updating monster
        // TODO: awill: Add a validation method in the monster manager
        // TODO: awill: Make this update asynchronous
        const tmpMon = new SummMon(updatedMonData);
        const resultOfUpdate = this.monMgr.updateMonster(returnVal.staleMonster.id, tmpMon);

        if (!resultOfUpdate) {
            res.statusCode = 500;
            returnVal.err = 'monsterNotUpdated';
            return res.json(returnVal);
        }

        returnVal.updatedMonster = resultOfUpdate;

        return res.json(returnVal);
    };

    private handleSearch(req, res, next): any {
        const searchTermName = req.query.name;
        const searchTermType = req.query.type;
        console.info(`[monsters] [router] [GET] [/search] name=${ searchTermName } type=${ searchTermType }`);
        const returnVal = {
            monsters: this.monMgr.searchMonsters({ name: searchTermName, type: searchTermType }),
            err: null,
        };

        res.json(returnVal);
    };

    private handleLookupById(req, res, next): any {
        const monId = parseInt(req.params.mon_id, 10);
        console.info(`[monsters] [router] [GET] [/:mon_id] mon_id=${ monId }`);
        const returnVal = {
            monster: this.monMgr.getMonster(monId),
            err: null,
        };

        res.json(returnVal);
    };

    private handleList(req, res, next): any {
        console.info('[monsters] [router] [/]');
        const output = (req.query.output || '');
        const outputArr: string[] = output
            .split(',')
            .filter((curr: string, ind: number, arr: string[]): boolean => {
                // NOTE: awill: this filters out badly formatted fields
                return String(curr).trim().length > 0;
            });
        const shouldCompress: boolean = output !== 'all';
        const returnVal = {
            monsters: this.monMgr.getMonsterArray(),
            err: null,
        };
        console.info(`outputArr=${ outputArr.length > 0 ? outputArr : '[]' } shouldCompress=${ shouldCompress }`)

        if (shouldCompress) {
            console.info('compressing...');
            returnVal.monsters = returnVal.monsters.map((mon: SummMon, ind: number, arr: SummMon[]): any => {
                const result = {
                    _tsCreation: mon._tsCreation,
                    _tsLastUpdate: mon._tsLastUpdate,
                    id: mon.id,
                    name: mon.name,
                };

                outputArr.forEach((prop: string, outputInd: number, outputArrArr: string[]): void => {
                    switch (prop) {
                        case 'level':
                        result[prop] = mon.level;
                        break;
                        case 'type':
                        result[prop] = mon.type;
                        break;
                        case 'image_base':
                        result[prop] = mon.image_base;
                        break;
                        case 'image_awakened':
                        result[prop] = mon.image_awakened;
                        break;
                    }
                });

                return result;
            });
        }

        res.json(returnVal);
    };
}

export { MonsterRouter };
