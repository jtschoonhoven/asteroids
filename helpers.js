/**
 * Wrap the jQuery.get method as a Node-style (error-first) callback.
 * On error, the callback will be called with one argument, an Error object.
 * On success the first argument will be null and the seocnd will contain response data.
 */
function request(url, cb) {
    $.get({
        url,
        success: data => cb(null, data),
        error: (_, err) => cb(new Error(err)),
    });
}


/**
 * Example error handler.
 * For demonstration only. This code is not suitable for real-world applications.
 */
function handleError(err) {
    console.log(err);
    if (err instanceof Error) {
        throw err;
    }
    throw new Error(err);
}


/**
 * Render a satellite directly to the DOM.
 * For demonstration only. This code is not suitable for real-world applications.
 */
function renderSatellite(asteroidData, cb) {
    const { speed, size, maxDistance, eccentricityIndex } = _parseAsteroidData(asteroidData);
    $('body').append($(`
        <div class="space" style="animation: rotate ${ Math.random() * 10 + 15 }s infinite linear;">
            <div class="gravity" style="animation: oscillate-${ eccentricityIndex } ${ speed / 2 }s infinite ease-in-out alternate;">
                <div class="satellite"
                    style="
                        background: #${ Math.floor(Math.random() * 10 + 6).toString(16).repeat(3) };
                        animation: orbit ${ speed }s infinite linear;
                        width: ${ size }px;
                        height: ${ size }px;
                        margin-left: -${ maxDistance }px;
                        transform-origin: ${ maxDistance }px center;
                    "
                ></div>
            </div>
        </div>
    `));
    cb();
}


/**
 * Process the data returned by the asteroid API and extract the data we need.
 *
 * EXAMPLE: {
 *   speed: number - asteroid velocity in KPS
 *   size: number - size of asteroid in *pixels*
 *   eccentricityIndex: number - orbit eccentrity scaled to an integer, 0-9
 *   maxDistance: max distance (major semi axis) from earth in *pixels*
 * }
 *
 * For demonstration only. This code is not suitable for real-world applications.
 */
function _parseAsteroidData(asteroid) {
    const approachData = asteroid.close_approach_data;
    const diameter = asteroid.estimated_diameter;
    const speed = approachData.length ? approachData[0].relative_velocity.kilometers_per_second : 100;
    const size = diameter ? diameter.meters.estimated_diameter_max / 50 : 1;
    const eccentricityIndex = Math.floor(asteroid.orbital_data.eccentricity * 10);
    const maxDistance = asteroid.orbital_data.semi_major_axis * 100;
    return { speed, size, maxDistance, eccentricityIndex };
}
