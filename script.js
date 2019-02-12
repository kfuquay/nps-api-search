'use strict';

//set variables for api key and base url
const api_key = 'x9FPrxPyJGnGgCikcmWW9vvjMZeqWjDkGSK5qFY';
const searchURL = 'https://api.nps.gov/api/v1/parks';

function displayResults(responseJson) {
    //clear previous results and search values
    $('.results-list').empty();
    $('.form').trigger("reset");

    //if api response contains no park data, alert user that search did not find any results
    if (responseJson.total === 0) {
        alert('Search did not return any results');
    } else {
    //iterate through results, insert desired data into DOM
    for (let i = 0; i < responseJson.data.length; i++) {
        $('.results-list').append(`
            <li><h3>Name: ${responseJson.data[i].fullName}</h3>
            <h4>Description: </h4><p>${responseJson.data[i].description}</p>
            <h4><a href="${responseJson.data[i].url}">VISIT WEBSITE</a></h4></li>
        `)
        }
    //show results
    $('.results').removeClass('hidden');
    }
}

function formatQueryString(params) {
    //iterate over params object format key and value pairs into valid url syntax
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getResults(search_term, limit) {
    //create params object
    const params = {
        key: api_key,
        stateCode: search_term,
        limit
    };

    //send params object to formatQueryString function, get valid url formatted querystring in return
    const queryString = formatQueryString(params);
    //create full url by adding queryString and base URL together
    const url = searchURL + '?' + queryString;

    //request data from NPS API
    fetch(url)
        //check status of API response, if response is not ok, throw error else parse response as json
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error (response.statusText);
        })
        //send json response to displayResults function
        .then(responseJson => displayResults(responseJson))
        //alert user if error occurred
        .catch(err => {
            alert(`Something went wrong: ${err.message}`);
        })
}

function watchForm() {
    //watch form for submit, gather values of user input, call getResults function
    $('.form').submit(event => {
        event.preventDefault();
        const search_term = $('.js-search-state').val();
        const limit = $('#js-search-number').val() - 1;
        getResults(search_term, limit);

    })
}

$(watchForm);