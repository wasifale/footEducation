/*
    Copyright (C) 2016  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
'use strict';

module.exports = function(pb) {

    //pb dependencies
    var util = pb.util;

    /**
     * Saves the site's content settings
     */
    function Libraries(){}
    util.inherits(Libraries, pb.BaseController);

    Libraries.prototype.render = function(cb) {
        var self = this;

        this.getJSONPostParams(function(err, post) {
            var message = self.hasRequiredParams(post, ['jquery', 'angular']);
            if(message) {
                cb({
                    code: 400,
                    content: pb.BaseController.apiResponse(pb.BaseController.API_FAILURE, message)
                });
                return;
            }

            pb.settings.set('libraries_settings', post, function(data) {
                if(util.isError(data)) {
                    cb({
                        code: 500,
                        content: pb.BaseController.apiResponse(pb.BaseController.API_FAILURE, self.ls.g('generic.ERROR_SAVING'), data)
                    });
                    return;
                }

                for(var key in post) {
                    pb.TemplateService.registerGlobal(key + '_src', post[key]);
                }

                cb({content: pb.BaseController.apiResponse(pb.BaseController.API_SUCCESS, self.ls.g('site_settings.LIBRARY_SETTINGS') + ' ' +  self.ls.g('admin.EDITED') + '. ' + self.ls.g('site_settings.LIBRARY_CLUSTER'))});
            });
        });
    };

    //exports
    return Libraries;
};
