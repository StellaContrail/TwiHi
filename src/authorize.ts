import { request } from "./request";

const OAuthBaseURL = "https://api.twitter.com/oauth/";

export default class Authorize {
    static async requestToken(params: IParams, consumerKeys: IConsumerKey) {
        const res = await request(
            "POST",
            OAuthBaseURL + "request_token",
            params,
            {
                consumer_key: consumerKeys.consumer_key, consumer_secret: consumerKeys.consumer_secret,
                oauth_token: "", oauth_token_secret: ""
            }
        );
        return res;
    }

    static async accessToken(oauth_verifier: string, consumerKeys: IConsumerKey, requestToken: IRequestToken) {
        const res = await request(
            "POST",
            OAuthBaseURL + "access_token",
            { oauth_token: requestToken.oauth_token, oauth_verifier: oauth_verifier },
            {
                consumer_key: consumerKeys.consumer_key, consumer_secret: consumerKeys.consumer_secret,
                oauth_token: requestToken.oauth_token, oauth_token_secret: requestToken.oauth_token_secret
            }
        );
        return res;
    }

    static getOAuthURL(mode: string, oauth_token: string): string {
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

    
    