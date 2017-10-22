import https from 'https'
import _ from 'lodash'

export class AlintaApp {

    constructor() {
        this.basicUrl = 'https://alintacodingtest.azurewebsites.net/'
    }

    run() {
        this.callApi('api/Movies', this.listActors)
    }

    callApi(api, callback) {

            https.get(this.basicUrl + api, (res) => {

                const {statusCode} = res;
                const contentType = res.headers['content-type'];

                let error;
                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
                }
                if (error) {
                    console.error(error.message)
                    // consume response data to free up memory
                    res.resume();
                    
                    return;
                    
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);

                        if (callback) {
                            callback(parsedData)
                        }

                    } catch (e) {
                        console.error(e.message);
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });

    }

    listActors(data) {

        if (data && data.length > 0) {
            let list = []

            data.forEach(e => {
                e.roles.forEach(r => {
                    if (r.actor) {
                        let role = new Role(r.name, e.name, r.actor)
                        list.push(role)
                    }
                })
            })

            list = _.uniqWith(list, _.isEqual)
            let groupList = _.groupBy(list, 'actor')

            Object
                .keys(groupList)
                .forEach(k => {
                    console.log(`${k} `)

                    let sortedList = _.sortBy(groupList[k], 'film')

                    sortedList.forEach(r => console.log(` * ${r.name} `))
                    groupList[k] = sortedList
                })
            // For test purpose 
            return groupList
        }
        return data
    }
}

export class Role {
    constructor(name, film, actor) {
        this.name = name || 'Unknown'
        this.film = film || 'Unknown'
        this.actor = actor || 'Unknown'
    }
}