import React, { useState } from "react";
import PropTypes from "prop-types";
import MapBox, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link } from "react-router-dom";
import "./style.scss";

MapSingle.propTypes = {
  marKers: PropTypes.array.isRequired,
};

function MapSingle({ marKers }) {
  const [popupOpen, setPopupOpen] = useState(null); // State to manage popup

  const [viewPort, setViewPort] = useState({
    longitude: -74.0004,
    latitude: 40.71,
    zoom: 14,
  });

  const handlePopupToggle = (id) => {
    // Toggle the popup state
    setPopupOpen((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="map-content">
      <MapBox
        viewState={viewPort}
        onMove={(evt) => setViewPort(evt.viewState)} // Update view state when map moves
        mapboxAccessToken="your-mapbox-access-token"
        style={{ width: "100%", height: 300 }}
        mapStyle="mapbox://styles/themesflat/cll6d64hy00m901pd1tbe65ra"
        scrollZoom={false}
      >
        {marKers.map((item) => (
          <div key={item.id}>
            <Marker
              longitude={item.longitude}
              latitude={item.latitude}
              anchor="center"
              closeOnClick={false}
              onClick={() => handlePopupToggle(item.id)}
            >
              <div className="marker marker-logo-cty">
                <img
                  src={item.img}
                  alt="img"
                  style={{ width: "28px", height: "28px" }}
                />
              </div>
            </Marker>

            {popupOpen === item.id && (
              <Popup
                longitude={item.longitude}
                latitude={item.latitude}
                anchor="center"
                onClose={() => setPopupOpen(null)} // Close the popup
                closeOnClick={false}
                closeButton={true}
                offsetLeft={10}
              >
                <div className="marker-popup">
                  <img src={item.img} alt="img" />
                  <div className="content">
                    <h4>{item.title}</h4>
                    <h3>
                      <Link to="/Jobsingle_v1">
                        {item.name}&nbsp;<span className="icon-bolt"></span>
                      </Link>
                    </h3>
                    <p>
                      <i className="icon-map-pin"></i>&nbsp;
                      {item.address}
                    </p>
                  </div>
                </div>
              </Popup>
            )}
          </div>
        ))}

        <NavigationControl position="top-left" />
      </MapBox>
    </div>
  );
}

export default MapSingle;
