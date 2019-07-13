{% assign site_map_opts = site.data.maps.shared.options %}
{% assign page_map_opts = site.data.maps[page.map_name] %}

// Load access token from config
mapboxgl.accessToken = '{{ site.data.maps.shared.mapbox_access_token }}';

var map = new mapboxgl.Map({
    center:             [{{ page_map_opts.map_center }}],
    container:          '{{ site_map_opts.container }}',
    style:              '{{ site_map_opts.style }}',
    zoom:               {{ site_map_opts.zoom }},
    trackResize:        {{ site_map_opts.trackResize }},
    dragPan:            {{ site_map_opts.dragPan }},
    touchZoomRotate:    {{ site_map_opts.touchZoomRotate }}
});


map.on('load', function() {
    // Add a new source from our GeoJSON data and set the
    // 'cluster' option to true. GL-JS will add the point_count property to your source data.
    map.addSource("{{ page_map_opts.source_name }}", {
        type: "geojson",
        data: "{{ page_map_opts.data_endpoint }}",
        cluster: true,
        clusterMaxZoom: 11, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    /* CIRCLE LAYERS */

    const circleLayerId = 'clusters';
    const circleDataLayerId = 'cluster-count';

    map.addLayer({
        id: circleLayerId,
        type: "circle",
        source: "{{ page_map_opts.source_name }}",
        filter: ["has", "point_count"],
/*        layout: {
            "fill-opacity": .5
        },*/
        paint: {
            "circle-opacity": .7,
            // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 10
            //   * Yellow, 30px circles when point count is between 10 and 20
            //   * Pink, 40px circles when point count is greater than or equal to 20
            "circle-color": [ "step", ["get", "point_count"], 
                              "#4298bb", 10,
                              "#fedd44", 20,
                              "#e87d2b"
            ],
            "circle-radius": [ "step", ["get", "point_count"],
                               20, 10, 
                               30, 20, 
                               40
            ]
        }
    });

    addHoverPointer(map, circleLayerId);
     
    map.on('click', circleLayerId, (ev) => {
        const coords = ev.features[0].geometry.coordinates.slice();
        map.flyTo({center:coords, zoom: map.getZoom()+1, speed: .6});
    })

    map.addLayer({
        id: circleDataLayerId,
        type: "symbol",
        source: "{{ page_map_opts.source_name }}",
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12
        }
    });

    /* SINGLE ICON LAYER */

    const singleIconLayerId = 'unclustered-point';

    map.loadImage("{{ site.baseurl }}/assets/images/shelter-icon.png", (error, img) => {
        map.addImage("shelter", img);
        map.addLayer({
            id: singleIconLayerId,
            type: "symbol",
            source: "{{ page_map_opts.source_name }}",
            filter: ["!", ["has", "point_count"]],
            layout: {
                "icon-image": "shelter"
            }
        });

        map.on('click', singleIconLayerId, (ev) => {
            const coords = ev.features[0].geometry.coordinates.slice();
            const props = ev.features[0].properties;
            const popup = new mapboxgl.Popup({
                offset: 25,
                className: 'shelter-popup'
            }).setHTML(popupTemplate(props));
            popup.setLngLat(coords).addTo(map);
        });

        addHoverPointer(map, singleIconLayerId);
    });

    var navControl = new mapboxgl.NavigationControl();
    map.addControl(navControl, 'bottom-right');

    var geoLocateCtl = new CustomGeoLocateControl1({
        className:         'control-geolocate',
        positionOptions:   { enableHighAccuracy: true },
        trackUserLocation: true
    });
    map.addControl(geoLocateCtl);
});

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Search by address.",
    mapboxgl: mapboxgl
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


class CustomGeoLocateControl1 extends mapboxgl.GeolocateControl {
    constructor (options) { super(options); }
    onAdd (map) {
        super.onAdd(map);
        console.log('_geolocateButton'+this._geolocateButton);
        var textLabel = document.createElement('div');
            textLabel.className = 'mapboxgl-ctrl-geolocate-label';
            textLabel.textContent = 'Where am I';
        this._container.appendChild(textLabel);
        return this._container;
    }
}

/***************************************************************************
 * METHODS
 ***************************************************************************/

/**
 * Changes the cursor to a pointer on hovering, back to arrow when leaving
 *
 * @param map - the map containing the layerId layer
 * @param layerId - ID of the map layer to add this functionality to
 */
function addHoverPointer(map, layerId) {
    // Change the cursor to a pointer when the it enters a feature in the layerId layer.
    map.on('mouseenter', layerId, function () {
        map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', layerId, function () {
        map.getCanvas().style.cursor = '';
    });
}

/**
 * https://github.com/hurricane-response/florence-api/issues/53
 *
 * Checks if address has "," to signify that it contains more than just the street number.
 *
 * @param shelter
 * @returns {boolean}
 */
function isFullAddress(shelter) {
    if (!shelter.address){
        return false;
    }
    return shelter.address.split(',').length > 1;
}

/**
 * Verifies there is a phone number received that is not "0000000000"
 *
 * @param shelter
 * @returns {boolean}
 */
function isPhone(shelter) {
    let phone = shelter.cleanPhone.trim();
    if (((/[^\d]/.test(phone)) || (phone.replace(/0+/g, '').length === 0)) && shelter.phone) {
        phone = shelter.phone.replace(/[^\d]/g, '');
    }
    return phone.replace(/[\-\+\(\)\s0]+/g, '').length !== 0;
}

/**
 * https://github.com/hurricane-response/florence-api/issues/53
 *
 * Joins the different address segments into a string,
 * if state has no value it will just join the zipcode after the city
 *
 * @param shelter
 * @returns {string}
 */
function shelterAddressToString(shelter) {
    return [
        shelter.address,
        shelter.city,
        shelter.state
        + ' '
        + shelter.zip
    ].join(', ');
}

/**
 * Replaces URLs in a string with anchor elements
 *
 * @param content {string}
 * @returns {string}
 */
function urlsToAnchors(content) {
    if (!content) {
        return void 0;
    }
    const urlMatchPattern = /(?:(?:https?):\/\/|www\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
    const urls = content.match(urlMatchPattern);
    if (!urls){
        return content;
    }
    urls.forEach(url => {
        content = content.replace(url, transformToAnchor(url));
    });
    return content;
}

/**
 * Replaces url with an html anchor
 *
 * @param url
 * @returns {string}
 */
function transformToAnchor(url) {
    return `<a role="link" href="${url}" target="_blank">${url}</a>`
}

/**
 * Builds a HTML template (Popup) from a shelter object.
 *
 * @params shelter
 * @returns {string}
 */
function popupTemplate(shelter) {
    const phoneLink = `
        <div class="phone">
            <svg id="icon-phone" viewBox="0 0 32 32" aria-label="phone icon">
                <path d="M22 20c-2 2-2 4-4 4s-4-2-6-4-4-4-4-6 2-2 4-4-4-8-6-8-6 6-6 6c0 4 4.109 12.109 8 16s12 8 16 8c0 0 6-4 6-6s-6-8-8-6z"></path>
            </svg>
            <div class="phone-details" aria-label="shelter phone number">
                <a class="phone" role="link" href="tel:${shelter.cleanPhone}">${shelter.phone}</a>
            </div>
        </div>
    `;
    const address = `
        <div class="address">
            <svg id="icon-address" viewBox="0 0 32 32" aria-label="address icon">
                <path d="M0 32h16v-32h-16v32zM10 4h4v4h-4v-4zM10 12h4v4h-4v-4zM10 20h4v4h-4v-4zM2 4h4v4h-4v-4zM2 12h4v4h-4v-4zM2 20h4v4h-4v-4zM18 10h14v2h-14zM18 32h4v-8h6v8h4v-18h-14z"></path>
            </svg>
            <div class="address-details" aria-label="address details">
                ${isFullAddress(shelter) ? shelter.address : shelterAddressToString(shelter)}
            </div>
        </div>
    `;
    const note = `
        <div class="note">
            <label><strong>Note:</strong></label>
            <div class="note-details" aria-label="Notes for shelter">
                ${urlsToAnchors(shelter.notes)}
            </div>
        </div>
    `;
    const petsNote = `
        <div class="note">
            <label><strong>Pets:</strong></label>
            <div class="note-details" aria-label="Notes for shelter pets policy">
                ${urlsToAnchors(shelter.pets_notes)}
            </div>
        </div>
    `;
    return `
        <header class="popup-header">
            <p class="is-size-4 has-text-centered">${shelter.shelter}</p>
        </header>
        <div class="shelter-details">
            <div class="content is-size-6 has-text-left">
                ${!!shelter.address ? address : ``}
                ${isPhone(shelter) ? phoneLink : ``}
                <div class="controls">
                    ${!!shelter.address
        ? `
                        <a class="directions button is-link" target="_blank" href="https://www.google.com/maps/dir/current+location/${encodeURIComponent(shelterAddressToString(shelter))}" aria-label="Get directions button">
                            <svg id="icon-directions" viewBox="0 0 32 32" aria-label="directions icon">
                                <path d="M17 32c-0.072 0-0.144-0.008-0.217-0.024-0.458-0.102-0.783-0.507-0.783-0.976v-15h-15c-0.469 0-0.875-0.326-0.976-0.783s0.129-0.925 0.553-1.123l30-14c0.381-0.178 0.833-0.098 1.13 0.199s0.377 0.749 0.199 1.13l-14 30c-0.167 0.358-0.524 0.577-0.906 0.577zM5.508 14h11.492c0.552 0 1 0.448 1 1v11.492l10.931-23.423-23.423 10.931z"></path>
                            </svg>
                            <div class="separator"></div>
                            <label>Directions</label>
                        </a>
                    `
        : ``}
                </div>
                ${!!shelter.notes ? note : ``}
                ${!!shelter.pets_notes ? petsNote : ``}
            </div>
        </div>
    `;
}
