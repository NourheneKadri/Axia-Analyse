// MapSection.jsx
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import maplibregl from "maplibre-gl";
import MapBox, { Marker, Popup, NavigationControl } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useDynamicMarkers from "../../assets/fakeData/dataMap";
import "./style.scss";
import { Link } from "react-router-dom";

MapSection.propTypes = {};

function MapSection({ className }) {
  const [popupOpen, setPopupOpen] = useState({});
  const mapContainerRef = useRef(null);
  const { markers, loading } = useDynamicMarkers(); // Utilisation du hook pour récupérer les marqueurs

  useEffect(() => {
    if (loading || !Array.isArray(markers) || markers.length === 0) return;

    // Initialiser la carte
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [10.1658, 36.81897], // Tunisie (Tunis)
      zoom: 6,
    });

    // Ajouter les marqueurs à la carte
    markers.slice(0, 6).forEach((item) => {
      const popup = new maplibregl.Popup({ offset: 30 }).setHTML(`
        <div style="
          font-family: 'Segoe UI', sans-serif;
          max-width: 250px;
          padding: 12px;
          border-radius: 12px;
          background-color: #fff;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
          text-align: center;
        ">
          <img 
            src="${item.img}" 
            alt="img" 
            style="width: 100%; height: auto; max-height: 140px; border-radius: 8px; object-fit: cover;" 
          />
          <div style="margin-top: 10px;">
            <h4 style="font-size: 16px; color: #2a8ef0; margin: 0 0 6px;">${item.title}</h4>
            <h3 style="margin: 0 0 6px; font-size: 14px;">
              <a 
                href="/Jobsingle_v1" 
                style="text-decoration: none; color: #333; font-weight: 600;"
              >
                ${item.name} <span class="icon-bolt"></span>
              </a>
            </h3>
            <p style="font-size: 12px; color: #666; margin: 0;">
              <i class="icon-map-pin" style="margin-right: 4px; color: #2a8ef0;"></i>${item.address}
            </p>
          </div>
        </div>
      `);
      

      new maplibregl.Marker({ color: "#" })
        .setLngLat([item.longitude, item.latitude])
        .setPopup(popup)
        .addTo(map);
    });

    return () => map.remove(); // Nettoyage de la carte au démontage du composant
  }, [markers, loading]); // Mise à jour des marqueurs à chaque changement

  const handlePopupToggle = (id) => {
    // Toggle le popup
    setPopupOpen((prevId) => (prevId === id ? null : id));
  };
  return (
    <section className={`wd-feature-map ${className ? className : ""}`}>
      <div className="tf-slider slider-map style-1">
        <div ref={mapContainerRef} style={{ width: "100%", height: "600px", borderRadius: "10px" }} />
      </div>
      
      {popupOpen !== null && markers.length > 0 && (
        <div className="popup-container">
          {/* Popup personnalisé pour afficher les informations détaillées */}
          {markers.map((item) =>
            item.id === popupOpen ? (
              <div className="popup-content" key={item.id}>
                <div className="marker-popup">
                  <img src={item.img} alt="img" />
                  <div className="content">
                    <h4>{item.title}</h4>
                    <h3>
                      <Link to="/Jobsingle_v1">
                        {item.name} <span className="icon-bolt"></span>
                      </Link>
                    </h3>
                    <p>
                      <i className="icon-map-pin"></i> {item.address}
                    </p>
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}

    </section>
  );
}

export default MapSection;

