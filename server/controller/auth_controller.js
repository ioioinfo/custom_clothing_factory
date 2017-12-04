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
                var platform_code = "custom_clothing";
                
                server.plugins.services.auth.login_by_barcode(org_code,platform_code,barcode,function(err,content) {
                    if (err) {
                        return reply({"success":false,"message":"error"});
                    }
                    
                    if (!content.success) {
                        return reply({"success":false,"message":content.message});
                    }
                    
                    //人员信息
                    var row = content.row;
                    
                    if (!row) {
                        return reply({"success":false,"message":"person not found"});
                    }
                    
                    var person_id = row.person_id;
                    
                    var ep = eventproxy.create("person","workflow_roles","avatar",function(person,workflow_roles,avatar) {
                        return reply({"success":true,"message":"ok","person":person,"workflow_roles":workflow_roles,"avatar":avatar});
                    });
                    
                    //查询人员信息
                    server.plugins.services.person.get_by_id(person_id,function(err,content) {
                        if (err) {
                            ep.emit("person",null);
                        } else {
                            ep.emit("person",content.row);
                        }
                    });
                    
                    //查询流程权限
                    server.plugins.services.auth.get_person_workflow_role(org_code,person_id,function(err,content) {
                        if (err) {
                            ep.emit("workflow_roles",null);
                        } else {
                            ep.emit("workflow_roles",content.rows);
                        }
                    });
                    
                    //查询人员头像
                    var person_ids = JSON.stringify([person_id]);
                    
                    server.plugins.services.person.get_avatar(person_ids,function(err,content) {
                        if (err || content.rows.length == 0) {
                            ep.emit("avatar",null);
                        } else {
                            ep.emit("avatar",content.rows[0]);
                        }
                    });
                });
            }
        },
        
    ]);

    next();
}

exports.register.attributes = {
    name: moduel_prefix
};
