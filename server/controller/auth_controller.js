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
var moment = require('moment');
var eventproxy = require('eventproxy');
const sys_option = require('../config/sys_option');
const uu_request = require('../utils/uu_request');

var moduel_prefix = sys_option.product_name + '_auth';

/*
权限验证模块.
*/
exports.register = function(server, options, next) {
    var person = server.plugins.services.person;
    
    server.route([
        //通过条码登录
        {
            method: 'POST',
            path: '/user/login_by_barcode',
            handler: function(request, reply) {
                //条码
                var barcode = request.payload.barcode;
                if (!barcode) {
                    return reply({"success":false,"message":"param barcode is null"});
                }
                
                var org_code = "ioio";
                
                server.plugins.services.auth.login_by_barcode(org_code,barcode,function(err,content) {
                    if (err) {
                        return reply({"success":false,"message":"error"});
                    }
                    
                    if (!content.success) {
                        return reply({"success":false,"message":content.message});
                    }
                    
                    return reply({"success":true,"message":"ok","row":content.row});
                });
            }
        },
        
    ]);

    next();
}

exports.register.attributes = {
    name: moduel_prefix
};
