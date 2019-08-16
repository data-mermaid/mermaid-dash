import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-minimap';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Wrapper = styled.div`
  position: fixed;
  width: ${props => props.width};
  height: ${props => props.height};
`;
const defaultMarkerColor = '#A53434';

const markerHtmlStyles = `
  background-color: ${defaultMarkerColor};
  width: 1rem;
  height: 1rem;
  display: block;
  position: relative;
  border-radius: 1.5rem;
  border: 1px solid #FFFFFF`;

const activeMarkerHtmlStyles = `
  position: absolute;
  border-radius: 50%;
  top: -200%;
  border: 6px solid ${defaultMarkerColor};
  width: 1.6rem;
  height: 1.6rem;
  background-color: white;
  animation-name: bounce;
  animation-fill-mode: both;
  animation-duration: 1s;
  `;

const activeInnerMarkerHtmlStyles = `
  position: absolute;
  content: '';
  width: 0px;
  height: 0px;
  bottom: -26px;
  left: -3px;
  border: 8px solid transparent;
  border-top: 15px solid ${defaultMarkerColor};
`;

const clusterIconNumberStyles = `
  color: white;
  font-size: 14px;
`;

const generateClusterIconStyle = ({
  baseRadius,
  basePadding,
  numberMarkers,
  defaultMarkerColor
}) => {
  const radius = String(numberMarkers).length * baseRadius + basePadding;
  let backgroundColor;
  switch (numberMarkers.length) {
    case 1:
      backgroundColor = 'red';
      break;
    case 2:
      backgroundColor = 'yellow';
      break;
    default:
      backgroundColor = defaultMarkerColor;
  }
  return `
    width: ${radius}px;
    height: ${radius}px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 1px solid white;
    background-color: ${backgroundColor};
  `;
};

const icon = L.divIcon({
  className: 'my-default-pin',
  html: `<div style="${markerHtmlStyles}" />`
});

const activeIcon = L.divIcon({
  className: 'my-active-pin',
  html: `<div style="${activeMarkerHtmlStyles}"><div style="${activeInnerMarkerHtmlStyles}"></div></div>`
});

const windowWidth = () => (window ? window.innerWidth : 1800);
const offsetX = w => 0.2 * w;

class LeafletMap extends Component {
  state = {
    highlightMarker: null
  };

  componentDidUpdate({ markersData: prevMarkersData }) {
    if (this.props.markersData !== prevMarkersData) {
      this.updateMarkers(this.props.markersData);
    }
    this.zoomFullMap();
  }

  componentDidMount() {
    const miniMapLayer = L.tileLayer(
        'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}',
        {
          attribution:
            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abcd',
          minZoom: 0,
          maxZoom: 13,
          ext: 'png'
        }
      ),
      imageryMapLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }
      ),
      mapLabelLayer = L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x} '
      );

    this.map = L.map('map', {
      center: [38, 16],
      zoom: 2,
      minZoom: 3,
      maxZoom: 17,
      zoomControl: true,
      layers: [imageryMapLayer, mapLabelLayer]
    });

    new L.Control.MiniMap(miniMapLayer, {
      position: 'bottomleft',
      width: 240,
      height: 140,
      zoomAnimation: true,
      toggleDisplay: true,
      aimingRectOptions: { color: '#91181A' },
      shadowRectOptions: {
        color: '#208FFF',
        weight: 1,
        interactive: false,
        opacity: 0,
        fillOpacity: 0
      },
      zoomLevelOffset: -6
    }).addTo(this.map);

    this.updateMarkers(this.props.markersData);
    this.zoomFullMap();
  }

  removeHighlight() {
    if (this.state.highlightMarker !== null) {
      this.state.highlightMarker.setIcon(icon);
      this.setState({ highlightMarker: null });
    }
  }

  setIconActive(marker) {
    marker.setIcon(activeIcon);
    this.setState({ highlightMarker: marker });
  }

  panToOffCenter(latlng, offset, options) {
    const x = latlng.containerPoint.x + offset[0],
      y = latlng.containerPoint.y - offset[1],
      currentZoom = this.map._zoom,
      newLatlng = this.map.containerPointToLatLng([x, y]);

    return this.map.setView(newLatlng, currentZoom, { pan: options });
  }

  zoomFullMap() {
    if (this.props.zoomFullMap) {
      this.map.setView([38, 16], 2);
    }
  }

  updateMarkers(markersData) {
    const markersCluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: false,
      iconCreateFunction: function(cluster) {
        const childCount = cluster.getChildCount();
        const clusterStyle = generateClusterIconStyle({
          baseRadius: 10,
          basePadding: 10,
          numberMarkers: childCount,
          defaultMarkerColor
        });

        return new L.DivIcon({
          html: `<div style="${clusterStyle}"><span style="${clusterIconNumberStyles}"> ${childCount} </span></div>`,
          className: 'marker-cluster-icon'
        });
      }
    });

    markersCluster.on('clusterclick', () => {
      this.props.fullMapZoomHandler(false);
    });

    markersData.forEach(marker => {
      const markerPoint = L.marker(
        [marker.geometry.coordinates[1], marker.geometry.coordinates[0]],
        { icon }
      );

      markersCluster.addLayer(
        markerPoint.on('click', e => {
          const responsiveOffSetX = offsetX(windowWidth());
          this.removeHighlight();
          this.setIconActive(markerPoint);
          this.props.siteClickHandler(marker);
          this.panToOffCenter(e, [responsiveOffSetX, 0], { animate: true });
        })
      );
    });

    this.map.addLayer(markersCluster);
  }

  render() {
    return <Wrapper width="100vw" height="calc(100vh - 49px)" id="map" />;
  }
}
export default LeafletMap;
