"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const querystring = require("querystring");
const crypto = require("crypto");
const fetch = require("node-fetch");
async function request(method, baseURL, extraParams, keys) {
    // Collecting parameters
    let params = createParameters(keys);
    params.oauth_signature = createSignature(method, baseURL, params, extraParams, keys);
    let headers = createHeader(params);
    let url = createURL(baseURL, extraParams);
    // HTTP Options
    let options = {
        method: method,
        headers: headers,
        url: url
    };
    const res = await fetch(url, options);
    const data = await res.text();
    return { status: res.ok, data: data };
}
exports.request = request;
function createURL(baseURL, extraParams) {
    let str = querystring.stringify(extraParams);
    if (str) {
        return (baseURL + '?' + str);
    }
    else {
        return baseURL;
    }
}
function createParameters(keys) {
    let params = {
        "oauth_consumer_key": keys.consumer_key,
        "oauth_nonce": getOAuthNonce(),
        //oauth_signature: SIGNATURE,
        //oauth_token: TOKEN,
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": getTimestamp(),
        "oauth_version": "1.0"
    };
    if (keys.oauth_token) {
        params.oauth_token = keys.oauth_token;
    }
    return params;
}
function createHeader(params) {
    let DST = 'OAuth ';
    for (const [key, value] of Object.entries(params)) {
        DST += escape(key) + '="' + escape(value) + '", ';
    }
    DST = DST.slice(0, -2);
    return { "Authorization": DST };
}
function createSignature(method, baseURL, baseParams, extraParams, keys) {
    let params = concat(baseParams, extraParams);
    params = encodeURIParameters(params);
    params = sortParameters(params);
    let paramStr = "";
    for (const [key, value] of Object.entries(params)) {
        paramStr += key + "=" + value + "&";
    }
    paramStr = paramStr.slice(0, -1);
    let baseStr = method.toUpperCase() + "&" + escape(baseURL) + "&" + escape(paramStr);
    let signingKey = escape(keys.consumer_secret) + "&" + escape(keys.oauth_token_secret);
    return hash_hmac(baseStr, signingKey);
}
function getOAuthNonce() {
    const series = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 32; i++) {
        result += series[Math.floor(Math.random() * series.length)];
    }
    return result;
}
function escape(str) {
    return encodeURIComponent(str).replace(/[!*()']/g, (c) => { return '%' + c.charCodeAt(0).toString(16); });
}
function getTimestamp() {
    return (Math.floor(new Date().getTime() / 1000)).toString();
}
function encodeURIParameters(params) {
    let encodedParams = {};
    for (const [key, value] of Object.entries(params)) {
        encodedParams[escape(key)] = escape(value);
    }
    return encodedParams;
}
function concat(array1, array2) {
    return Object.assign(Object.assign({}, array1), array2);
}
function sortParameters(params) {
    let keys = Object.keys(params);
    keys.sort();
    let sortedParams = {};
    for (let i = 0; i < keys.length; i++) {
        sortedParams[keys[i]] = params[keys[i]];
    }
    return sortedParams;
}
function hash_hmac(baseStr, signingKey) {
    return crypto
        .createHmac("sha1", signingKey)
        .update(baseStr)
        .digest("base64");
}
