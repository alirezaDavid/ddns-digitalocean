'use strict';

const config = require('../config/config.json');
const request = require('request-promise');
const Promise = require('bluebird');
const getIp = require('external-ip')();

const baseUrl = `https://api.digitalocean.com/v2`;
let requestHeader;

const urlApiRequest = {
    setApiKey: (apiKey) => {
      requestHeader = {
        headers: {
          'Content-Type': `application/json`,
          'Authorization': `Bearer ${apiKey}`
        }
      };
    },
    getListOfDomains: () => {
        const apiUrl = `${baseUrl}/domanis`;
        return request.get(apiUrl, requestHeader);
      },

    getDomain: (domain) => {
        const apiUrl = `${baseUrl}/domains/${domain}`;
        return request.get(apiUrl, requestHeader);
      },

    createDomain: (domainName, ip) => {
        const apiUrl = `${baseUrl}/domains`;
        return request.post(apiUrl, {headers: requestHeader.headers, body: JSON.stringify({name: domainName, ip_address: ip})});
      },

    getListOfDomainRecords: (domain) => {
        const apiUrl = `${baseUrl}/domains/${domain}/records`;
        return request.get(apiUrl, requestHeader);
      },

    createDomainRecord: (domain, type, name ,data) => {
        const apiUrl = `${baseUrl}/domains/${domain}/records`;
        return request({
          uri: apiUrl,
          method: 'POST',
          headers: requestHeader.headers,
          body: {
            type: type,
            name: name,
            data: data,
            priority: null,
            port: null,
            weight: null
          },
          json: true
        });
      },

    updateDomainRecord: (domain, recordId, type, name, data) => {
      const apiUrl = `${baseUrl}/domains/${domain}/records/${recordId}`;

      return request({
        uri: apiUrl,
        method: 'PUT',
        headers: requestHeader.headers,
        body: {
          type: type,
          name: name,
          data: data,
          priority: null,
          port: null,
          weight: null
        },
        json: true
      });
    },

    getGlobalIp: () => {
      return new Promise((resolve, reject) => {
        return getIp((err, ip) => {
          if (err) {
            return reject(err);
          }

          return resolve(ip);
        });
      });
    },
  };

module.exports = urlApiRequest;
