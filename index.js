const { stringify } = require('querystring');
const axios = require('axios');
const parser = require('xml2json');

const PVIT_URL = "https://mypvit.com/pvit-secure-full-api.kk";
const actionValues = [1, 2, 3, 5];
const serviceValues = ["REST", "WEB"];
const operateurValues = ["AM", "MC"];

exports.OngouaPvit = class OngouaPvit {
    constructor(tel_marchand, token) {
        this.tel_marchand = tel_marchand;
        this.montant = 0;
        this.ref = "";
        this.tel_client = "";
        this.token = token;
        this.action = 1;
        this.service = "REST";
        this.operateur = "AM";
        this.agent = "OngouaPvit";
    }

    validate() {
        return new Promise((resolve, reject) => {
            if (!this.tel_marchand)
                reject("'tel_marchand' parameter is required");
            else if (!this.montant)
                reject("'montant' parameter is required");
            else if (!this.ref)
                reject("'ref' parameter is required");
            else if (!this.tel_client)
                reject("'tel_client' parameter is required");
            else if (!this.action)
                reject("'action' parameter is required");
            else if (!this.service)
                reject("'service' parameter is required");
            else if (!this.operateur)
                reject("'operateur' parameter is required");
            else if (!this.isValidNumber(this.tel_marchand))
                reject("tel_marchand is not a correct number");
            else if (!this.isValidNumber(this.tel_client))
                reject("tel_client is not a correct number");
            else if (!this.ref)
                reject("ref parameter is required");
            else if (this.ref.length > 13)
                reject("the 'ref' value must be 13 characters maximum");
            else if (!actionValues.includes(this.action))
                reject("the 'action' value is incorrect. Possible values are : " + actionValues.join(", "));
            else if (!serviceValues.includes(this.service))
                reject("the 'service' value is incorrect. Possible values are : " + serviceValues.join(", "));
            else if (!operateurValues.includes(this.operateur))
                reject("the 'operateur' value is incorrect. Possible values are : " + operateurValues.join(", "));
            else if (parseInt(this.montant) < 100 || parseInt(this.montant) > 490000)
                reject("the 'montant' value must be between 100 and 490000");
            else resolve();
        })
    }

    isValidNumber(number) {
        return (number && number.length === 9 && (/(0){1}([6-7]){1}([0-9]){7}/).test(number));
    }

    lowerKeys(obj) {
        const keyValues = Object.keys(obj).map(key => {
            const newKey = key.toLowerCase();
            return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    }

    send() {
        return this.validate().then(() => {
            return axios.post(PVIT_URL, stringify({ ...this })).then((res) => {
                try {
                    const resPvit = parser.toJson(res.data, { object: true });
                    res.json = this.lowerKeys(resPvit.REPONSE);
                } catch (e) {
                    console.log(e);
                }

                return res
            });
        });


    }
}