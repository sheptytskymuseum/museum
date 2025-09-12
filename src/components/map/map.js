"use client";

import { Marker, GoogleMap, LoadScript } from "@react-google-maps/api";

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    scrollwheel: true,
};

export default function MyMap() {
    const position = { lat: 49.8452, lng: 24.0359 };
    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        >
            <GoogleMap
                options={mapOptions}
                mapContainerStyle={{ height: "600px", width: "100%" }}
                center={{ lat: 49.8452, lng: 24.0359 }}
                zoom={16}
            >
                <Marker position={position} />
            </GoogleMap>
        </LoadScript>
    );
}
