"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
const OAuthBaseURL = "https://api.twitter.com/oauth/";
class Authorize {
    static async requestToken(params, consumerKeys) {
        const res = await request_1.request("POST", OAuthBaseURL + "request_token", params, {
            consumer_key: consumerKeys.consumer_key, consumer_secret: consumerKeys.consumer_secret,
            oauth_token: "", oauth_token_secret: ""
        });
        return res;
    }
    static async accessToken(oauth_verifier, consumerKeys, requestToken) {
        const res = await request_1.request("POST", OAuthBaseURL + "access_token", { oauth_token: requestToken.oauth_token, oauth_verifier: oauth_verifier }, {
            consumer_key: consumerKeys.consumer_key, consumer_secret: consumerKeys.consumer_secret,
            oauth_token: requestToken.oauth_token, oauth_token_secret: requestToken.oauth_token_secret
        });
        return res;
    }
    static getOAuthURL(mode, oauth_token) {
        switch (mode.toLowerCase()) {
            case "authenticate":
                return OAuthBaseURL + "authenticate?oauth_token=" + oauth_token;
            case "authorize":
                return OAuthBaseURL + "authorize?oauth_token=" + oauth_token;
            default:
                throw new Error("You need to specify both parameters in getOAuthURL");
        }
    }
}
exports.default = Authorize;
