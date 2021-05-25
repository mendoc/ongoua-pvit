# ongoua-pvit
A npm package for use PVit payment gateway

## Installation

Using npm:
```shell
$ npm i ongoua-pvit
```

Using yarn:
```shell
$ yarn add ongoua-pvit
```
## Examples
### Submitting request
```js
const { OngouaPvit } = require("ongoua-pvit");

const TEL_MARCHAND = process.env.TEL_MARCHAND;
const TOKEN        = process.env.TOKEN;

const clientPvit = new OngouaPvit(TEL_MARCHAND, TOKEN);

clientPvit.tel_client   = "074567890";
clientPvit.montant      = 100;
clientPvit.ref          = "PROD2X3T8";

clientPvit.send().then((response) => {
    const data = response.json;
    if (data) {
        // Do something with data
        console.log(data.statut);
        console.log(data.message);
    }
}).catch((error) => {
    console.log("Error handling");
    console.log(error);
});
```
### In your PVit callback
```js
const { OngouaPvit } = require("ongoua-pvit");

// xmlPVit contains XML response provided by PVit
const data = OngouaPvit.parse(xmlPVit)

if (data) {
    // Do something with data
    console.log(data.statut);
    console.log(data.message);
    console.log(data.ref);
}
```

## Report bug
DM me on Twitter [@DimitriONGOUA](https://twitter.com/DimitriOngoua)