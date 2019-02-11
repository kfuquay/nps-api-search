'use strict';

const api_key = 'x9FPrxPyJGnGgCikcmWW9vvjMZeqWjDkGSK5qFY';

function displayResults(responseJson) {
    //clear previous results and search values
    $('.results-list').empty();
    $('#js-search-state').val('');
    $('#js-search-number').val('');

    //if api response contains no park data, alert user that search did not find any results
    if (responseJson.total === 0) {
        alert('Search did not return any results');
    } else {
    //iterate through results, insert desired data into DOM
    for (let i = 0; i < responseJson.data.length; i++) {
        $('.results-list').append(`
            <li><h3>Name: ${responseJson.data[i].fullName}</h3>
            <h4>Description: </h4><p>${responseJson.data[i].description}</p>
            <h4><a href="${responseJson.data[i].url}">Website</a></h4></li><hr>
        `)
    }
    //show results
    $('.results').removeClass('hidden');
}
}

function getResults(state, limit) {
    //request data from NPS API
    fetch(`http://api.nps.gov/api/v1/parks?api_key=${api_key}&limit=${limit}&q=${state}`)
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
        const state = $('#js-search-state').val();
        const limit = $('#js-search-number').val() - 1;
        getResults(state, limit);

    })
}

$(watchForm);