'use client';
import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DivIcon } from 'leaflet';
const Leaflet = ({lat, lng} : {lat: number, lng: number}) => {
  // Create an instance of DivIcon
  const svgString = `<svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
    d="M10.0044 10C10.4181 10 10.7708 9.85269 11.0625 9.55808C11.3542 9.26346 11.5 8.90929 11.5 8.49558C11.5 8.08186 11.3527 7.72917 11.0581 7.4375C10.7635 7.14583 10.4093 7 9.99558 7C9.58186 7 9.22917 7.14731 8.9375 7.44192C8.64583 7.73654 8.5 8.09071 8.5 8.50442C8.5 8.91814 8.64731 9.27083 8.94192 9.5625C9.23654 9.85417 9.59071 10 10.0044 10ZM10 18C7.81979 16.1791 6.1914 14.4877 5.11483 12.926C4.03828 11.3642 3.5 9.90972 3.5 8.5625C3.5 6.70139 4.11806 5.14236 5.35417 3.88542C6.59028 2.62847 8.13542 2 9.98958 2C11.8438 2 13.3924 2.62847 14.6354 3.88542C15.8785 5.14236 16.5 6.70139 16.5 8.5625C16.5 9.90972 15.9653 11.3611 14.8958 12.9167C13.8264 14.4722 12.1944 16.1667 10 18Z"
    fill="currentColor"
    />
  </svg>`

  const markderIcon = new DivIcon({
    html: svgString,
    className: 'custom-div-icon', // Optional: add custom classes for styling
    iconSize: [32, 32], // Set size if necessary
  });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '300px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[lat, lng]} icon={markderIcon}>
        <Popup>
          Customer Location
        </Popup>
      </Marker>
    </MapContainer>
  );
};
export default Leaflet;