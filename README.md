# TwiHi
Yet another Async Twitter API library for Typescript/Node.js

Uses ```node-fetch``` instead of ```Request``` which has already deprecated.

## Usage
```typescript
var TwiHi = require("twihi");

let T = new TwiHi({
    consumer_key: "consumer_key",
    consumer_secret: "consumer_secret",
    oauth_token: "(optional) oauth_token",
    oauth_token_secret: "(optional) oauth_token_secret"
});

//
//  User OAuth
//
let requestToken: IRequestToken = await T.requestToken(callback_url);
let url: string = T.getAuthenticateURL(requestToken);
console.log(url);
let accessToken: IAccessToken = await T.accessToken(oauth_verifier, requestToken);
T.setAccessToken(accessToken);

// Pin code authorization, oauth/authorize are also available
requestToken: IRequestToken = await T.requestToken();
url: string = T.getAuthorizeURL(requestToken);
console.log(url);
accessToken: IAccessToken = await T.accessToken(oauth_verifier, requestToken);
T.setAccessToken(accessToken);

//
//  Timeline
//
let timeline = await T.get("statuses/home_timeline", { count: "5" });

//
//  Tweet
//
let tweet = await T.post("statuses/update", { status: "tweet" });

//
//  Followings
//
let followings = T.get("friends/list", { screen_name: "twitterapi" });
// Parameter can be omitted when not necessary.
followings = T.get("friends/list");

//
// Followers
//
let followers = T.get("followers/ids", { screen_name: "twitter" });
// Promise is also available
followers = T.get("followers/ids").then((x) => { console.log(x); });
```

## Class & Functions
### ``` T = new TwiHi(config) ```
Creates a ```TwiHi``` instance for the access to the Twitter API.

If you're using with the user context, the ```config``` should be:
```Typescript
config = {
    consumer_key: "consumer_key",
    consumer_secret: "consumer_secret",
    oauth_token: "(optional) oauth_token",
    oauth_token_secret: "(optional) oauth_token_secret"
}
```
```oauth_token``` and ```oauth_token_secret``` are optional at the initialization.
Note that you still need to fill these information later when you want to request for the user-context features. 

In the case used only with the application context though, the ```config``` can be:
```Typescript
config = {
    consumer_key: "consumer_key",
    consumer_secret: "consumer_secret"
}
```

### ```T.get(path, [params])```
Send a GET request to the REST API.
Can be used for endpoints which ends with ```.json```.

**path** specifies the endpoint. available for flexible forms. (e.g. **/friends/list.json, /statuses/update, statuses/home_timeline.json**)

**params** is optional, and specifies parameters for the request.

### ```T.post(path, [params])```
Send a POST request to the REST API.

Parameters are the same as ```T.get(path, [params])```.

### ```T.getREST(url, [params])```
Send a GET request to the REST API with full url specification.

**url** is required as full specification. (e.g. **https://api.twitter.com/oauth/authenticate**, **https://api.twitter.com/1.1/account/verify_credentials.json**)

### ```T.postREST(url, [params])```
Send a POST request to the REST API with full url specification.

### ```IRequestToken T.requestToken([callbackURL])```
Get a request token to request user authorization.
Can be used for 3-legged / PIN-Based OAuth.

**callbackURL** is optional. 
If you skip it, the PIN-Based OAuth is selected.
Otherwise the 3-legged OAuth is selected, and the user is directed to the login page of the callback URL.

### ```String T.getAuthenticateURL(requestToken, [force_login])```
Get the Login page URL for authorization with ```oauth/authenticate```.
When authorizing with 3-legged OAuth, you should not use this function to avoid ```oauth/authenticate```.
The detailed description can be seen at "[Twitter API: 3-legged authorization](https://developer.twitter.com/ja/docs/basics/authentication/overview/3-legged-oauth)" page.

**requestToken** is the same with the one returned by ```T.requestToken([callbackURL])```.

**force_login** is optional, and ```boolean```.
It (un)enables ```force_login``` so as to force users to enter their credentials.

### ```String T.getAuthorizeURL(requestToken, [force_login])```
Get the Login page URL for authorization with ```oauth/authorize```.
The difference from the one of ```oauth/authenticate``` is that this one doesn't prompt users who has already granted the permission so they don't have to re-approve the application.


### ```IAccessToken T.accessToken(oauth_verifier, requestToken)```
Get an access token by exchanging the request token.

**oauth_verifier** is the one returned by ```T.getAuthorizeURL(requestToken, [force_login])```.

**requestToken** is the one returned by ```T.requestToken([callbackURL])```.


### ```Void T.setAccessToken(requestToken)```
Store the access token.

You can also manually set the token instead of calling this function.

## Features
* Easy to use
* Promise (async/await)
* OAuth 1.0
* REST

## Todos
* OAuth 2.0
* Stream API
* Error handling
* Media upload
* Direct interfaces for requests

## Dependencies
* node.js
* (typescript)
* node-fetch
* query-string

## License
MIT License