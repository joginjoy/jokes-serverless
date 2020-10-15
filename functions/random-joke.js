const axios = require('axios');

exports.handler = async function (event, context) {

    try {
        // only relevant for dev. For prod, values are passed in as env variables
        require('dotenv').config();
    } catch (e) {
        console.log('Failed parsing .env file. Can be ignored for Production!')
    }

    // Passed in as Environment variable
    const {API_URL, API_HEADER_HOST, API_HEADER_KEY, ALLOWED_ORIGINS} = process.env;

    // API call
    const options = {
        method: 'GET',
        url: API_URL,
        headers: {
            'x-rapidapi-host': API_HEADER_HOST,
            'x-rapidapi-key': API_HEADER_KEY
        }
    };

    // calling ext. API
    const callApi = () => {
        return axios.request(options)
            .then(res => res.data)
            .catch(err => err)
    }

    // send response back to the caller
    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': ALLOWED_ORIGINS
            },
            body: JSON.stringify(await callApi())
        };
    } else {
        return {
            statusCode: 405,
            body: event.httpMethod + ' is not supported'
        };
    }
}
