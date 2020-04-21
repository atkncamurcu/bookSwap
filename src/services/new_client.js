import {SimpleAlert} from '../components/AlertModal';

class Client {
    constructor() {
        this.token = null;
        this.verificated = false;
        this.root = "http://94.177.170.53:3000/api/v1"
    }

    fetch = async function (url, method, body = null) {
        let response = await fetch(url, {
            method,
            ...(!!body ? {body: JSON.stringify(body)} : {}),
            mode: 'cors',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(!!this.token ? {'Authorization': 'Bearer ' + this.token} : {})
            },
        });
        let json = await response.json();
        if (!response.ok) {
            if (!json.success) {
                let errors = Object.values(json.errors);
                let errorString = errors.reduce((s, v) => s + "\n" + v.reduce((ss, vv) => ss + "\n" + vv, ""), "");
                SimpleAlert('Error', errorString);
                throw (errorString);
            } else {
                SimpleAlert('Error', response.statusText);
                throw (response.statusText);
            }
        }
        if (!!json.token) {
            this.setToken(json.token, json.verificated)
        }
        return json;
    };

    setToken(token, verificated = true) {
        this.token = token;
        this.verificated = verificated
    }

    getToken() {
        return this.token;
    }

    getVerification() {
        return this.verificated;
    }

    async get(path) {
        return (await this.fetch(this.root + path, 'GET'))
    }

    async post(path, body = {}) {
        return (await this.fetch(this.root + path, 'POST', body))
    }

    async patch(path, body = {}) {
        return (await this.fetch(this.root + path, 'PATCH', body))
    }

    async put(path, body = {}) {
        return (await this.fetch(this.root + path, 'PUT', body))
    }

    async delete(path) {
        return (await this.fetch(this.root + path, 'DELETE'))
    }
}

export default new Client()