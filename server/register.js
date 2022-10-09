'use strict';
const plugin = require('../admin/src/pluginId')

module.exports = ({ strapi }) => {
    strapi.customFields.register({
        name: 'country',
        plugin,
        type: 'string',
    });
};
