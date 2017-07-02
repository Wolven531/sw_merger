'use strict';

const express = require('express');

const MonsterMgr = require('../lib/managers/MonsterManager');

const router = express.Router();

// NOTE: this is route initialization code
// TODO: awill: move this init code somewhere more sensible
const monsterMgr = new MonsterMgr();
monsterMgr.init();

// NOTE: this endpoint comes first for specificity
router.get(['/:mon_id'], (req, res, next) => {
    console.info(`[monsters] [router] [/:mon_id] mon_id=${ req.params.mon_id }`);
    let mapKey = String(req.params.mon_id);
    let returnVal = {
        monster: monsterMgr.getMonsterMap()[mapKey],
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
