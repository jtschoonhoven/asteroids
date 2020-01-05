/**
 * Examples of asynchronous techniques in Javascript.
 * Makes a series of async requests to NASA asteroids API and visualizes them in the DOM.
 */

const API_KEY = 'DEMO_KEY'; // replace this with your own key from api.nasa.gov
const NASA = new NasaApiClient(API_KEY);
let page = 1;


/**
 * Fetch asteroid data from NASA API and render into DOM using Node-style CALLBACKS.
 *
 * Before native promises arrived in ES6, this was how most async Javascript was written:
 * Each consecutive step takes place inside a callback with its own error handling.
 * The extra nesting and redundant error handling makes the code hard to follow. We can do better!
 */
function loadAsteroidsWithCallbacks() {

    // fetch list of asteroids from NASA API
    NASA.fetchAsteroidsPage(page, (err, response) => {
        if (err) {
            return handleError(err);
        }
        let asteroidCount = 0;
        const asteroids = response.near_earth_objects;

        // for each asteroid in response...
        asteroids.forEach(item => {

            // fetch orbit data for asteroid from NASA API
            NASA.fetchAsteroidDetails(item.id, (err, asteroid) => {
                if (err) {
                    return handleError(err);
                }

                // render the satellite in the DOM
                NASA.renderAsteroid(asteroid, (err) => {
                    asteroidCount += 1;
                    if (err) {
                        return handleError(err);
                    }

                    // go to next page when all asteroids have rendered
                    if (asteroidCount === asteroids.length) {
                        page += 1;
                        console.log('success');
                    }
                });
            });
        });
    });
}


/**
 * Fetch asteroid data from NASA API and render into DOM using the ASYNC LIBRARY.
 *
 * To help tame the callback beast, the (3rd party) async library became popular.
 * The result is a bit more elegant, but (in this case) hardly more readable.
 * See the async docs at https://caolan.github.io/async/v3/docs.html.
 */
function loadAsteroidsWithAsyncLib() {

    // fetch list of asteroids from NASA API
    NASA.fetchAsteroidsPage(page, (err, response) => {
        if (err) {
            return handleError(err);
        }
        let asteroidCount = 0;
        const asteroids = response.near_earth_objects;

        // for each asteroid in response...
        async.map(asteroids, (item) => {
            async.waterfall([

                // fetch orbit data for asteroid from NASA API
                NASA.fetchAsteroidDetails.bind(NASA, item.id),

                // render the satellite in the DOM
                NASA.renderAsteroid,
            ], (err) => {
                if (err) {
                    return handleError(err);
                }

                // go to next page when all asteroids have rendered
                asteroidCount += 1;
                if (asteroidCount === asteroids.length) {
                    page += 1;
                    console.log('success');
                }
            });
        }, handleError);
    });
}


/**
 * Fetch asteroid data from NASA API and render into DOM using ES6 PROMISES.
 *
 * Promises can be chained together to give more control over what happens when.
 * Promises do more with less. This *should* lead to code that is more readable.
 * However, I personally find the logic of chained promises harder to follow than callbacks.
 */
function loadAsteroidsWithPromises() {

    // fetch list of asteroids from NASA API
    NASA.fetchAsteroidsPage(page).then(response => {

        // for each asteroid in response...
        const asteroids = response.near_earth_objects;
        return Promise.all(asteroids.map((item) => {

            // fetch orbit data for asteroid from NASA API
            return NASA.fetchAsteroidDetails(item.id).then(asteroid => {

                // render the satellite in the DOM
                NASA.renderAsteroid(asteroid)
            });
        }));
    })
    .then(() => {
        // go to next page when all asteroids have rendered
        page += 1;
        console.log('success')
    })
    .catch(handleError);
}


/**
 * Fetch asteroid data from NASA API and render into DOM using ES8 ASYNC/AWAIT.
 *
 * Using async/await allows you to write async code as though it were synchronous.
 * The keyword "await" simply tells Javascript to come back to this when it's finished.
 * This hides the ugliness of promises with highly-readable code.
 */
async function loadAsteroidsWithAsyncAwait() {
    try {
        // fetch list of asteroids from NASA API
        const result = await NASA.fetchAsteroidsPage(page);
        const asteroids = result.near_earth_objects;

        // for each asteroid in list...
        for (const item of asteroids) {

            // fetch orbit data for asteroid from NASA API
            const asteroid = await NASA.fetchAsteroidDetails(item.id);

            // render the satellite in the DOM
            await NASA.renderAsteroid(asteroid);
        }
    }
    catch (error) {
        return handleError(error);
    }
    // go to next page when all asteroids have rendered
    page += 1;
    console.log('success');
}


/**
 * Example error handler.
 * For demonstration only. This code is not suitable for real-world applications.
 */
function handleError(err) {
    if (err) {
        const el = $(`<div class="alert">${ err }</div>`);
        $('.container-alert').append(el);
        setTimeout(() => el.remove(), 2000);
    }
}
