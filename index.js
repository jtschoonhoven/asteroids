const API_KEY = 'DEMO_KEY'; // replace this with your own key from api.nasa.gov
const NASA = new NasaApiClient(API_KEY);
let page = 0; // track which pages have already been fetched from the API


/**
 * Fetch asteroid data from NASA API and render into DOM.
 */
function loadAsteroids() {
    page += 1;

    // fetch list of asteroids from NASA API
    NASA.fetchAsteroidsPage(page, (err, asteroids) => {
        if (err) {
            return handleError(err);
        }

        // for each asteroid in list...
        for (const item of asteroids.near_earth_objects) {

            // fetch orbit data for asteroid from NASA API
            NASA.fetchAsteroidDetails(item.id, (err, asteroid) => {
                if (err) {
                    return handleError(err);
                }

                // render the satellite in the DOM
                NASA.renderAsteroid(asteroid, (err) => {
                    if (err) {
                        return handleError(err);
                    }
                    console.log('success');
                });
            });
        }}
    );
}


// async function loadAsteroids() {
//     page += 1;

//     try {
//         // fetch list of asteroids from NASA API
//         const asteroids = await NASA.fetchAsteroidsPage(page);
//         for (const item of asteroids.near_earth_objects) {

//             // fetch orbit data for asteroid from NASA API
//             const asteroid = await NASA.fetchAsteroidDetails(item.id);

//             // render the satellite in the DOM
//             await NASA.renderAsteroid(asteroid);
//             console.log('success');
//         }
//     }
//     catch (error) {
//         handleError(error);
//     }
// }


/**
 * Example error handler.
 * For demonstration only. This code is not suitable for real-world applications.
 */
function handleError(err) {
    console.log(err);
}
