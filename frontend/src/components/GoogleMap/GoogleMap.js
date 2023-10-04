import React, {useState, useEffect} from 'react';
import {GoogleMap, useJsApiLoader, Marker} from '@react-google-maps/api';


const googleMapApiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
const googleMapGeocodeURL = process.env.REACT_APP_GOOGLE_MAP_GEOCODE_URL;
const googleMapsLibraries = ["places"];


function GoogleMapComponent({address, width, height}) {
    const [coordinates, setCoordinates] = useState(null);


    const containerStyle = {
        width: width,
        height: height
    };

    useEffect(() => {
        const fetchCoordinates = async (addressToCoords) => {
            try {
                const response = await fetch(
                    `${googleMapGeocodeURL}${encodeURIComponent(addressToCoords)}&key=${googleMapApiKey}`
                );

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                if (data.status === 'OK') {
                    const {lat, lng} = data.results[0].geometry.location;
                    setCoordinates({lat, lng});
                } else {
                    throw new Error('Geocoding was not successful for the given address.');
                }
            } catch (error) {
                console.error('Error fetching coordinates:', error);
            }
        };

        fetchCoordinates(address);
    }, [address]);

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapApiKey,
        libraries: googleMapsLibraries
    });


    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={coordinates}
            zoom={16}
        >
            <Marker position={coordinates}/>
        </GoogleMap>
    ) : <></>;
}

export default React.memo(GoogleMapComponent);
