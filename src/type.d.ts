declare module "querystring";
declare module "crypto";
declare module "node-fetch"

// ----- for debug -----
declare module "readline";

interface IAccessToken {
    oauth_token: string,
    oauth_token_secret: string;
}

interface IRequestToken {
    oauth_token: string,
    oauth_token_secret: string;
}

interface IConsumerKey {
    consumer_key: string,
    consumer_secret: string
}

interface IParams {
    [key: string]: string;
}