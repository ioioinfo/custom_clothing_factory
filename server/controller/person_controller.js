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

var moduel_prefix = sys_option.product_name + '_person';

exports.register = function(server, options, next) {
    var person = server.plugins.services.person;
    
    server.route([
        //发送短信验证码
        {
            method: 'POST',
            path: '/send_sms',
            handler: function(request, reply) {
                //手机号
                var mobile = request.payload.mobile;
                if (!mobile) {
                    return reply({"success":false,"message":"param mobile is null"});
                }
                
                var url = "http://139.196.148.40:11111/api/mobile_sms?platform_code="+sms_platform_code+"&send_type=ali_sms&mobile="+mobile;
                uu_request.do_get_method(url,function(err,content) {
                    if (err) {
                        return reply({"success":false,"message":"error"});
                    }
                    
                    if (!content.success) {
                        return reply({"success":false,"message":content.message});
                    }
                    
                    return reply({"success":true,"message":"ok"});
                });
            }
        },
        
    ]);

    next();
}

exports.register.attributes = {
    name: moduel_prefix
};
