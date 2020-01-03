const API_KEY = 'DEMO_KEY'; // replace this with your own key from api.nasa.gov
let PAGE = 0; // track which pages have already been fetched from the API


/**
 * Fetch asteroid data from NASA API and render into DOM.
 */
function loadAsteroids() {
    PAGE += 1;
    const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}&page=${PAGE}`;
    // fetch list of asteroids from NASA API
    request(url, (err, asteroidsList) => {
        if (err) {
            return handleError(err);
        }
        // for each asteroid in list...
        for (const asteroidEntry of asteroidsList.near_earth_objects) {
            // fetch orbit data for asteroid from NASA API
            request(asteroidEntry.links.self, (err, asteroidData) => {
                if (err) {
                    return handleError(err);
                }
                // render the satellite in the DOM
                renderSatellite(asteroidData, (err) => {
                    if (err) {
                        return handleError(err);
                    }
                    console.log('success');
                });
            });
        }}
    );
}
