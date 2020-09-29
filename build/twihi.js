"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.__useDefault = void 0;
const request_1 = require("./request");
const authorize_1 = __importDefault(require("./authorize"));
const querystring = require("querystring");
const APIBaseURL = "https://api.twitter.com/1.1/";
const APIPathRegex = /(^\/)|(.json)$/g;
class TwiHi {
    constructor(_keys) {
        if (!_keys.consumer_key || !_keys.consumer_secret) {
            throw new Error("Consumer keys are not optional.");
        }
        this.keys = {
            consumer_key: _keys.consumer_key,
            consumer_secret: _keys.consumer_secret,
            oauth_token: _keys.oauth_token || "",
            oauth_token_secret: _keys.oauth_token_secret || ""
        };
    }
    async getREST(url, params) {
        const res = await request_1.request("GET", url, params, this.keys);
        if (res.status) {
            return { data: res.data };
        }
        else {
            return JSON.parse(res.data);
        }
    }
    async postREST(url, params) {
        const res = await request_1.request("POST", url, params, this.keys);
        if (res.status) {
            return { data: res.data };
        }
        else {
            return JSON.parse(res.data);
        }
    }
    async get(path, params) {
        let _path = TwiHi.formatAPIPath(path);
        return await this.getREST(APIBaseURL + _path, params);
    }
    async post(path, params) {
        let _path = TwiHi.formatAPIPath(path);
        return await this.postREST(APIBaseURL + _path, params);
    }
    async requestToken(callback) {
        const res = await authorize_1.default.requestToken({ oauth_callback: callback || "oob" }, this.keys);
        if (res.status) {
            return querystring.parse(res.data);
        }
        else {
            throw new Error(res.data);
        }
    }
    getAuthenticateURL(requestToken, force_login) {
        return authorize_1.default.getOAuthURL("authenticate", requestToken.oauth_token + (force_login ? "&force_login=" + force_login.toString() : ""));
    }
    getAuthorizeURL(requestToken, force_login) {
        return authorize_1.default.getOAuthURL("authorize", requestToken.oauth_token + (force_login ? "&force_login=" + force_login.toString() : ""));
    }
    async accessToken(oauth_verifier, requestToken) {
        // request for accessToken
        const res = await authorize_1.default.accessToken(oauth_verifier, { consumer_key: this.keys.consumer_key, consumer_secret: this.keys.consumer_secret }, { oauth_token: requestToken.oauth_token, oauth_token_secret: requestToken.oauth_token_secret });
        if (res.status) {
            return querystring.parse(res.data);
        }
        else {
            throw new Error(res.data);
        }
    }
    setAccessToken(accessToken) {
        this.keys.oauth_token = accessToken.oauth_token;
        this.keys.oauth_token_secret = accessToken.oauth_token_secret;
    }
}
exports.default = TwiHi;
TwiHi.formatAPIPath = (path) => { return path.replace(APIPathRegex, "") + ".json"; };
exports.__useDefault = true;
