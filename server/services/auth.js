/**
 ┌──────────────────────────────────────────────────────────────┐
 │               ___ ___ ___ ___ ___ _  _ ___ ___               │
 │              |_ _/ _ \_ _/ _ \_ _| \| | __/ _ \              │
 │               | | (_) | | (_) | || .` | _| (_) |             │
 │              |___\___/___\___/___|_|\_|_| \___/              │
 │                                                              │
 │                                                              │
 │                       set up in 2015.2                       │
 │                                                              │
 │   committed to the intelligent transformation of the world   │
 │                                                              │
 └──────────────────────────────────────────────────────────────┘
*/

'use strict';

var _ = require('lodash');
var eventproxy = require('eventproxy');
const util = require('util');
const uu_request = require('../utils/uu_request');

var host = "http://211.149.248.241:18666/";

var nav = function(server) {
    return {
        login_by_barcode: function(org_code, barcode,cb) {
            var url = host + "user/login_by_barcode";
            var data = {org_code:org_code,login_code:barcode};

            uu_request.do_post_method(url, data, function(err, content) {
                cb(err,content);
            });
        },
    };
};

module.exports = nav;