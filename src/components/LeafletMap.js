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
  background-color: ${defaultMarkerColor};
  width: 1.4rem;
  height: 1.4rem;
  display: block;
  position: relative;
  border-radius: 1rem 1rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

const activeInnerMarkerHtmlStyles = `
  background-color: white;
  width: 0.7rem;
  height: 0.7rem;
  position: absolute;
  border-radius: 1rem;
  top: 20%;
  left: 20%;
`;

const icon = L.divIcon({
  className: 'my-default-pin',
  html: `<div style="${markerHtmlStyles}" />`
});

const activeIcon = L.divIcon({
  className: 'my-active-pin',
  html: `<div style="${activeMarkerHtmlStyles}"><div style="${activeInnerMarkerHtmlStyles}"></div></div>`
});

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
    );

    this.map = L.map('map', {
      center: [38, 16],
      zoom: 2,
      minZoom: 3,
      maxZoom: 17,
      zoomControl: true,
      layers: [
        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          {
            attribution:
              'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
          }
        )
      ]
    });

    new L.Control.MiniMap(miniMapLayer, {
      position: 'bottomleft',
      width: 260,
      height: 160,
      zoomAnimation: true,
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

  updateMarkers(markersData) {
    const markersCluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: false
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
          this.removeHighlight();
          this.setIconActive(markerPoint);
          this.props.siteClickHandler(marker);
          this.panToOffCenter(e, [350, 0], { animate: true });
        })
      );
    });

    this.map.addLayer(markersCluster);
  }

  zoomFullMap() {
    if (this.props.zoomFullMap) {
      this.map.setView([38, 16], 2);
    }
  }

  render() {
    return <Wrapper width="100vw" height="calc(100vh - 49px)" id="map" />;
  }
}
export default LeafletMap;
