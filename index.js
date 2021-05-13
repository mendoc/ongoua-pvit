const { stringify } = require('querystring');
const axios = require('axios');
const parser = require('xml2json');

const PVIT_URL = "https://mypvit.com/pvit-secure-full-api.kk";

exports.OngouaPvit = class OngouaPvit {
    constructor() {
        this.tel_marchand = "";
        this.montant = "";
        this.ref = "";
        this.tel_client = "";
        this.token = "";
        this.action = 1;
        this.service = "REST";
        this.operateur = "AM";
        this.agent = "OngouaPvit";
    }

    lowerKeys(obj) {
        const keyValues = Object.keys(obj).map(key => {
            const newKey = key.toLowerCase();
            return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    }

    send() {
        return axios.post(PVIT_URL, stringify({ ...this })).then((res) => {

            try {
                const resPvit = parser.toJson(res.data, { object: true });
                res.json = this.lowerKeys(resPvit.REPONSE);
            } catch (e) {
                console.log(e);
            }

            return res
        });
    }
}