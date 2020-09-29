import querystring = require("querystring");
import crypto = require("crypto");
import fetch = require("node-fetch");

export async function request(method: string, baseURL: string, extraParams: any, keys: IConsumerKey & IAccessToken) {
    // Collecting parameters
    let params = createParameters(keys);
    params.oauth_signature = createSignature(method, baseURL, params, extraParams, keys);
    let headers = createHeader(params);
    let url: string = createURL(baseURL, extraParams);

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

function createURL(baseURL: string, extraParams: IParams) {
    let str = querystring.stringify(extraParams);
    if (str) {
        return (baseURL + '?' + str);
    } else {
        return baseURL;
    }
}

function createParameters(keys: IConsumerKey & IAccessToken): IParams {
    let params: IParams = {
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


function createHeader(params: IParams) {
    let DST = 'OAuth ';
    for (const [key, value] of Object.entries(params)) {
        DST += escape(key) + '="' + escape(value) + '", ';
    }
    DST = DST.slice(0, -2);
    return { "Authorization": DST };
}


function createSignature(method: string, baseURL: string, baseParams: IParams, extraParams: IParams, keys: IConsumerKey & IAccessToken) {
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
    
function getOAuthNonce(): string {
    const series = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for(let i = 0; i < 32; i++){
        result += series[Math.floor(Math.random()*series.length)];
    }
    return result;
}
    
function escape(str: string): string {
    return encodeURIComponent(str).replace(/[!*()']/g, (c) => { return '%' + c.charCodeAt(0).toString(16); });
}

function getTimestamp(): string {
    return (Math.floor(new Date().getTime() / 1000)).toString();
}

function encodeURIParameters(params: IParams): IParams {
    let encodedParams: IParams = {};
    for (const [key, value] of Object.entries(params)) {
        encodedParams[escape(key)] = escape(value);
    }
    return encodedParams;
}

function concat(array1: IParams, array2: IParams) {
    return { ...array1, ...array2 };
}
    
function sortParameters(params: IParams): IParams {
    let keys = Object.keys(params);
    keys.sort();
    let sortedParams: IParams = {};
    for (let i = 0; i < keys.length; i++) {
        sortedParams[keys[i]] = params[keys[i]];
    }
    return sortedParams;
}

function hash_hmac(baseStr: string, signingKey: string) {
    return crypto
        .createHmac("sha1", signingKey)
        .update(baseStr)
        .digest("base64");
}