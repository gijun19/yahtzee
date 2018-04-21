/*
 * Utils
 *
 * Copyright (c) 2018 ProKnow, LLC. All rights reserved.
 */
'use strict';


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Mathematics

exports.isSequential = function(array) {
    for (var i = 1; i < array.length; ++i) {
        if (array[i] - array[i - 1] !== 1) {
            return false;
        }
    }
    return true;
};


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Errors

exports.error = function(code, message) {
    var err = new Error(message);
    err.code = code;
    return Promise.reject(err);
};

exports.errorHandler = function(req, res) {
    return function(err) {
        if (err && typeof err.code === 'number' && err.code > 0) {
            if (err.message) {
                res.status(err.code).send(err.message);
            } else {
                res.status(err.code).end();
            }
        } else {
            console.log();
            console.log("[" + (new Date()).toJSON() + "] Undefined exception was thrown");
            if (err) {
                console.log(err.stack || err);
            }
            res.status(500).end();
        }
    };
};
