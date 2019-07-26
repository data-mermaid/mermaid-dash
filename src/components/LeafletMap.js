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
const myCustomColour = '#A53434';

const markerHtmlStyles = `
  background-color: ${myCustomColour};
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  left: -1rem;
  top: -1rem;
  position: relative;
  border-radius: 2rem;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

const icon = L.divIcon({
  className: 'my-custom-pin',
  iconAnchor: [0, 24],
  labelAnchor: [-6, 0],
  popupAnchor: [0, -36],
  html: `<span style="${markerHtmlStyles}" />`
});

class LeafletMap extends Component {
  componentDidUpdate({ markersData: prevMarkersData }) {
    if (this.props.markersData !== prevMarkersData) {
      this.updateMarkers(this.props.markersData);
    }
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

    this.layer = L.layerGroup().addTo(this.map);
    this.updateMarkers(this.props.markersData);
  }

  updateMarkers(markersData) {
    const markersCluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: false
    });

    this.layer.clearLayers();
    markersData.forEach(marker => {
      markersCluster.addLayer(
        L.marker([marker.geometry.coordinates[1], marker.geometry.coordinates[0]], { icon }).on(
          'click',
          () => {
            this.props.siteClickHandler(marker);
          }
        )
      );
    });

    this.map.addLayer(markersCluster);
  }

  render() {
    return <Wrapper width="100vw" height="calc(100vh - 49px)" id="map" />;
  }
}
export default LeafletMap;
