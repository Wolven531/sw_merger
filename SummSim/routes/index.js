'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    let returnVal = {
        err: null,
        endpoints: [
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
                        type: 'string',
                    },
                },
                description: 'Try to retrieve a monster by id; will 404 is id is not found',
            },
            {
                path: '/monsters/:id',
                method: 'put',
                params: {
                    id: {
                        type: 'string',
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
                        type: 'string',
                    },
                },
                description: 'Try to delete a monster by id',
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
        ],
    };

    // NOTE: awill: Learned about req.app.get from this stack overflow:
    // https://stackoverflow.com/a/18145714
    returnVal.endpoints = returnVal.endpoints.map((endpointObj, ind, arr) => {
        endpointObj.example = `${ req.app.get('ngrokUrl') }${ endpointObj.path }`;
        return endpointObj;
    });

    res.json(returnVal);
});

module.exports = router;
