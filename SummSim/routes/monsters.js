'use strict';

const express = require('express');

const MonsterMgr = require('../lib/managers/MonsterManager');

const router = express.Router();

// NOTE: this is route initialization code
// TODO: awill: move this init code somewhere more sensible
const monsterMgr = new MonsterMgr();
monsterMgr.init();

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
    console.info(
        `[monsters] [router] [PUT] [/:mon_id] mon_id=${req.params.mon_id}`
    );
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
router.get(['/:mon_id'], (req, res, next) => {
    console.info(
        `[monsters] [router] [GET] [/:mon_id] mon_id=${req.params.mon_id}`
    );
    let returnVal = {
        monster: monsterMgr.getMonster(req.params.mon_id),
        err: null,
    };

    res.json(returnVal);
});

router.get(['/'], (req, res, next) => {
    console.info('[monsters] [router] [/]');
    let returnVal = {
        monsters: monsterMgr.getMonsterArray(),
        err: null,
    };

    res.json(returnVal);
});

module.exports = router;
