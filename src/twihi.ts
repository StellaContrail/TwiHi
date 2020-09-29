import { request } from "./request";
import authorize from "./authorize";
import querystring = require("querystring");

const APIBaseURL = "https://api.twitter.com/1.1/";
const APIPathRegex = /(^\/)|(.json)$/g;

export default class TwiHi {
    keys: IConsumerKey & IAccessToken;
    constructor(_keys: Partial<IConsumerKey & IAccessToken>) {
        if (!_keys.consumer_key || !_keys.consumer_secret) {
            throw new Error("Consumer keys are not optional.");
        }
        this.keys = {
            consumer_key: _keys.consumer_key,
            consumer_secret: _keys.consumer_secret,
            oauth_token: _keys.oauth_token || "",
            oauth_token_secret: _keys.oauth_token_secret || ""
        }
    }

    private static formatAPIPath = (path: string) => { return path.replace(APIPathRegex, "") + ".json"; }

    async getREST(url: string, params?: IParams) {
        const res = await request("GET", url, params, this.keys);
        if (res.status) {
            return { data: res.data };
        } else {
            return JSON.parse(res.data);
        }
    }
    async postREST(url: string, params?: IParams) {
        const res = await request("POST", url, params, this.keys);
        if (res.status) {
            return { data: res.data };
        } else {
            return JSON.parse(res.data);
        }
    }

    async get(path: string, params?: IParams) {
        let _path = TwiHi.formatAPIPath(path);
        return await this.getREST(APIBaseURL + _path, params);
    }
    async post(path: string, params?: IParams) {
        let _path = TwiHi.formatAPIPath(path);
        return await this.postREST(APIBaseURL + _path, params);
    }
    
    async requestToken(callback?: string) {
        const res = await authorize.requestToken({ oauth_callback: callback || "oob" }, this.keys);
        
        if (res.status) {
            return querystring.parse(res.data) as IRequestToken;
        } else {
            throw new Error(res.data);
        }
    }

    getAuthenticateURL(requestToken: IRequestToken, force_login?: boolean) {
        return authorize.getOAuthURL("authenticate", requestToken.oauth_token + (force_login ? "&force_login=" + force_login.toString() : "") );
    }
    getAuthorizeURL(requestToken: IRequestToken, force_login?: boolean) {
        return authorize.getOAuthURL("authorize", requestToken.oauth_token + (force_login ? "&force_login=" + force_login.toString() : "") );
    }

    async accessToken(oauth_verifier: string, requestToken: IRequestToken) {
        // request for accessToken
        const res = await authorize.accessToken(
            oauth_verifier,
            { consumer_key: this.keys.consumer_key, consumer_secret: this.keys.consumer_secret },
            { oauth_token: requestToken.oauth_token, oauth_token_secret: requestToken.oauth_token_secret }
        );
        if (res.status) {
            return querystring.parse(res.data) as IAccessToken;
        } else {
            throw new Error(res.data);
        }
    }

    setAccessToken(accessToken: IAccessToken) {
        this.keys.oauth_token = accessToken.oauth_token;
        this.keys.oauth_token_secret = accessToken.oauth_token_secret;
    }
}