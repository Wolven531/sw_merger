'use strict';

const express = require('express');

const router = express.Router();

module.exports = function(monsterMgr) {
    router.delete(['/:mon_id'], (req, res, next) => {
        console.info(
            `[monsters] [router] [DELETE] [/:mon_id] mon_id=${req.params.mon_id}`
        );
        let returnVal = {
            staleMonster: null,
            err: null,
        };
        let staleMonster = monsterMgr.getMonster(req.params.mon_id);

        if (!staleMonster) {
            res.statusCode = 404;
            returnVal.err = 'noMonster';
            return res.json(returnVal);
        }

        // TODO: awill: Make this remove asynchronous

        monsterMgr.removeMonster(staleMonster.id);

        return res.json(returnVal);
    });

    router.put(['/:mon_id'], (req, res, next) => {
        console.info(`[monsters] [router] [PUT] [/:mon_id] mon_id=${req.params.mon_id}`);
        let returnVal = {
            staleMonster: null,
            updatedMonster: null,
            err: null,
        };
        let staleMonster = monsterMgr.getMonster(req.params.mon_id);
        let updatedMonData = req.body || null;
        let resultOfUpdate = null;

        if (!staleMonster) {
            res.statusCode = 404;
            returnVal.err = 'noMonster';
            return res.json(returnVal);
        }
        if (!updatedMonData) {
            res.statusCode = 400;
            returnVal.err = 'noMonsterData';
            return res.json(returnVal);
        }

        // TODO: awill: Add a data validation call here before directly updating monster
        // TODO: awill: Add a validation method in the monster manager
        // TODO: awill: Make this update asynchronous

        resultOfUpdate = monsterMgr.updateMonster(
            staleMonster.id,
            updatedMonData
        );

        if (!resultOfUpdate) {
            res.statusCode = 500;
            returnVal.err = 'monsterNotUpdated';
            return res.json(returnVal);
        }

        returnVal.updatedMonster = resultOfUpdate;

        return res.json(returnVal);
    });

    // NOTE: this endpoint comes first for specificity
    router.get(['/search'], (req, res, next) => {
        console.info(`[monsters] [router] [GET] [/search] name=${ req.query.name }`);
        const searchTermName = String(req.query.name);
        let returnVal = {
            monsters: monsterMgr.searchMonsters({ name: searchTermName }),
            err: null,
        };

        res.json(returnVal);
    });

    // NOTE: this endpoint comes first for specificity
    router.get(['/:mon_id'], (req, res, next) => {
        console.info(`[monsters] [router] [GET] [/:mon_id] mon_id=${req.params.mon_id}`);
        let returnVal = {
            monster: monsterMgr.getMonster(req.params.mon_id),
            err: null,
        };

        res.json(returnVal);
    });

    router.get(['/'], (req, res, next) => {
        console.info('[monsters] [router] [/]');
        const output = (req.query.output || '');
        let outputArr = output
            .split(',')
            .filter((curr, ind, arr) => {
                // NOTE: awill: this filters out badly formatted fields
                return String(curr).trim().length > 0;
            });
        const shouldCompress = output !== 'all';
        let tmpMons = monsterMgr.getMonsterArray();
        let returnVal = {
            monsters: [],
            err: null,
        };

        if (shouldCompress) {
            tmpMons = tmpMons.map((mon, ind, arr) => {
                let result = {};

                if (outputArr.length < 1) {
                    result = {
                        id: mon.id,
                        name: mon.name,
                    };
                    return result;
                }
                outputArr.forEach((prop, ind, arr) => {
                    if (typeof mon[prop] !== 'undefined') {
                        result[prop] = mon[prop];
                    }
                });
                return result;
            });
        }
        returnVal.monsters = tmpMons;

        res.json(returnVal);
    });

    return router;
};
