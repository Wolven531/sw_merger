'use strict';

const fs = require('fs');
const path = require('path');

const SummMon = require('../../models/monster');

const MonsterMgr = function() {
    let internalMap = {};

    const getMonster = (monId) => {
        if (!monId) {
            return null;
        }
        // NOTE: awill: if performance becomes a pain, remove reflection checks like
        // this and just auto force the variable to a string via explicit casting
        // (instead of checking then converting, only convert)
        if (typeof monId !== 'string') {
            monId = String(monId);
        }

        return internalMap[monId];
    };
    const getMonsterMap = (forceRefresh) => {
        console.info(`${ this.compName } [getMonsterMap] params: forceRefresh=${ forceRefresh }`);
        // NOTE: this adds explicit type safety for the optional param
        forceRefresh = forceRefresh ? true : false;
        if (forceRefresh) {
            internalMap = loadFromDisk();
        }
        return internalMap;
    };
    const getMonsterArray = () => {
        console.info(`${ this.compName } [getMonsterArray]`);
        let results = [];
        let keys = Object.keys(internalMap || {});

        // NOTE: each validation case is handled separately for explicity
        if (!internalMap) {
            return results;
        }
        if (keys.length < 1) {
            return results;
        }

        for (let i = 0; i < keys.length; i++) {
            results.push(internalMap[keys[i]]);
        }
        return results;
    };
    const updateMonster = (monId, monster) => {
        if (!monId) {
            return null;
        }
        if (!monster) {
            return null;
        }
        if (typeof monId !== 'string') {
            monId = String(monId);
        }
        // NOTE: this forces any monster that did not already exist to fail an update attempt
        if (!getMonster(monId)) {
            return null;
        }
        internalMap[monId] = monster;

        return internalMap[monId];
    };
    const loadFromDisk = () => {
        console.info(`${ this.compName } [loadFromDisk] About to load from disk...`);
        const elems = SummMon.MONSTER_ELEMENT.asArray();
        // let mons = [];
        let monMap = {};
        let fp = '';
        let monCount = 0;

        elems.forEach((t, ind, arr) => {
            let filename = '';
            let mapKey = '';
            let monData = null;
            let newMon = null;
            const dataDir = path.resolve(`${ __dirname }${ path.sep }..${ path.sep }..${ path.sep }data${ path.sep }${ t }${ path.sep }`);

            fp = dataDir;

            if (!fs.existsSync(fp)) {
                console.warn(`Data dir was missing: ${ fp } | __dirname = ${ __dirname }`);
                return;
            }

            const jsonFiles = fs.readdirSync(fp, { encoding: 'utf8' }).filter((currFileName, ind, arr) => {
                return path.extname(currFileName) === '.json';
            });

            console.info(`Dir ${ fp } had ${ jsonFiles.length } files`);
            for (let i = 0; i < jsonFiles.length; i++) {
                filename = jsonFiles[i];
                fp = path.resolve(`${ dataDir }${ path.sep }${ filename }`);

                console.info(`About to read file, fp = ${ fp }`);
                monData = fs.readFileSync(fp, { encoding: 'utf8', flag: 'r' });

                newMon = new SummMon(monData);
                mapKey = String(newMon.id);

                monMap[mapKey] = newMon;
                monCount++;
            }
        });
        console.info(`Total mon count: ${ monCount }`);

        return monMap;
    };
    const init = () => {
        console.info(`${ this.compName } [init] Initializing monster manager...`);
        internalMap = loadFromDisk();
    };

    this.compName = '[MonsterMgr]';
    this.init = init;
    this.loadFromDisk = loadFromDisk;
    this.getMonster = getMonster;
    this.getMonsterMap = getMonsterMap;
    this.getMonsterArray = getMonsterArray;
    this.updateMonster = updateMonster;
};

module.exports = MonsterMgr;
