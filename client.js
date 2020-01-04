/**
 * An API Client for fetching data from the official NASA API at api.nasa.gov.
 * All methods support both promises and Node-style callbacks.
 */
class NasaApiClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Fetch one page of asteroid data from Nasa API. Pages are indexed from 1;
     * Supports both promises and Node-style callbacks.
     */
    async fetchAsteroidsPage(pageIndex, callback) {
        pageIndex = pageIndex || 1;
        const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${this.apiKey}&page=${pageIndex}`;
        return this._request(url, callback);
    }

    /**
     * Fetch details for one specific asteroid from Nasa API.
     * Supports both promises and Node-style callbacks.
     */
    async fetchAsteroidDetails(asteroidId, callback) {
        const url = `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${this.apiKey}`;
        return this._request(url, callback);
    }

    async _request(url, callback) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json()
            })
            .then(data => {
                if (callback) {
                    callback(null, data);
                }
                return data;
            })
            .catch(error => {
                if (callback) {
                    callback(error);
                }
            });
    }

    /**
     * Render a satellite directly to the DOM.
     * For demonstration only. This code is not suitable for real-world applications.
     */
    async renderAsteroid(asteroid, callback) {
        return new Promise((resolve, reject) => {
            let speed, size, eccentricityIndex, maxDistance;
            try {
                const approachData = asteroid.close_approach_data;
                const diameter = asteroid.estimated_diameter;
                speed = approachData.length ? approachData[0].relative_velocity.kilometers_per_second : 100;
                size = diameter ? diameter.meters.estimated_diameter_max / 50 : 1;
                eccentricityIndex = Math.floor(asteroid.orbital_data.eccentricity * 10);
                maxDistance = asteroid.orbital_data.semi_major_axis * 100;
            }
            catch (error) {
                if (callback) {
                    callback(error);
                }
                return reject(error);
            }
            setTimeout(() => {
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
                if (callback) {
                    callback(null, asteroid);
                }
                resolve(asteroid);
            }, 0);
        });
    }
}
