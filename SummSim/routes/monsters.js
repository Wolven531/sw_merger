'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const SummMon = require('../models/monster');

const router = express.Router();

const loadFromDisk = function() {
    console.info('[monster] [router] [loadFromDisk] About to load from disk...');
    const elems = SummMon.MONSTER_ELEMENT.asArray();
    let mons = [];
    let fp = '';

    elems.forEach(function(t, ind, arr) {
        let filename = '';
        let monData = null;
        let newMon = null;

        fp = path.resolve(`${ __dirname }${ path.sep }..${ path.sep }data${ path.sep }${ t }${ path.sep }`);

        if (!fs.existsSync(fp)) {
            console.warn(`Path was missing: ${ fp } | __dirname = ${ __dirname }`);
            return;
        }

        const jsonFiles = fs.readdirSync(fp, { encoding: 'utf8' }).filter(function(currFileName, ind, arr) {
            return path.extname(currFileName) === '.json';
        });

        console.info(`Dir ${ fp } had ${ jsonFiles.length } files`);
        for (let i = 0; i < jsonFiles.length; i++) {
            filename = jsonFiles[i];
            fp = path.resolve(`${ __dirname }${ path.sep }..${ path.sep }data${ path.sep }${ t }${ path.sep }${ filename }`);

            console.info(`About to read file, fp = ${ fp }`);
            monData = fs.readFileSync(fp, { encoding: 'utf8', flag: 'r' });
            newMon = new SummMon(monData);
            mons.push(newMon);
        }
    });
    console.info(`Total mon count: ${ mons.length }`);
    return mons;
};

const ALL_MONSTERS = loadFromDisk();

router.get('/', function(req, res, next) {
    let returnVal = {
        monsters: ALL_MONSTERS,
        err: null,
    };

    res.json(returnVal);
});

module.exports = router;
