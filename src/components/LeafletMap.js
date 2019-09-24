import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-minimap';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import * as leafletProperty from '../leaflet_property';
import styled from 'styled-components/macro';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const MapContainer = styled.div`
  height: 100%;
  padding-right: ${props => (props.open ? '650px' : '0px')};
`;

const MapFrame = styled.div`
  height: 100%;
  width: 100%;
  outline: 10px solid black;
`;

const Wrapper = styled.div`
  height: calc(100vh - 49px);
`;

const windowWidth = () => (window ? window.innerWidth : 1800);
const offsetX = w => 0.15 * w;

const generateClusterIconStyle = ({
  baseRadius,
  basePadding,
  margin,
  numberMarkers,
  defaultMarkerColor,
  setPulseAnimation
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
    margin-left: ${margin}px;
    margin-top: ${margin}px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 1px solid white;
    background-color: ${backgroundColor};
    animation: ${setPulseAnimation && 'pulse 1s'} ;
  `;
};

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
  worldImageryMapLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }
  ),
  labelLayer = L.tileLayer(
    'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x} '
  );

const mapProperty = {
  center: [10, 170],
  zoom: 3,
  minZoom: 3,
  maxZoom: 16,
  zoomControl: true,
  layers: [worldImageryMapLayer, labelLayer]
};

const miniMapProperty = {
  position: 'bottomleft',
  width: 240,
  height: 130,
  zoomAnimation: true,
  toggleDisplay: true,
  aimingRectOptions: { color: '#91181A' },
  shadowRectOptions: {
    color: '#2CBB4D',
    weight: 1,
    interactive: false,
    opacity: 0,
    fillOpacity: 0
  },
  zoomLevelOffset: -7
};

class LeafletMap extends Component {
  state = {
    mapZoomLevel: mapProperty.zoom,
    mapBoundingBoxCorner: null
  };

  componentDidUpdate(prevProps, prevState) {
    const { markersData: prevMarkersData } = prevProps;
    const { markersData } = this.props;
    const {
      mapZoomLevel: prevMapZoomLevel,
      mapBoundingBoxCorner: prevMapBoundingBoxCorner
    } = prevState;
    const { mapZoomLevel, mapBoundingBoxCorner } = this.state;

    if (markersData !== prevMarkersData) {
      this.updateMarkers(this.props.markersData);
    }

    if (mapZoomLevel !== prevMapZoomLevel) {
      this.updateBoundingBoxFromZoom();
    }

    if (mapBoundingBoxCorner !== prevMapBoundingBoxCorner) {
      this.updateBoundingBoxFromPan();
    }
    if (this.props.open) {
      this.map.invalidateSize();
      console.log(this.map);
    }
    this.zoomToSelectedSite();
    this.zoomFullMap();
  }

  componentDidMount() {
    this.map = L.map('map', mapProperty);
    const miniMapControl = new L.Control.MiniMap(miniMapLayer, miniMapProperty);
    const initMapBounds = this.map.getBounds();
    const initBbox = this.createBoundingBox(initMapBounds);
    const initSouthBbox = initMapBounds.getSouth();

    miniMapControl.addTo(this.map);

    this.setState({ mapZoomLevel: this.map.getZoom() });
    this.setState({ mapBoundingBoxCorner: initSouthBbox });
    this.props.getMapBounds(initBbox);
    this.updateBoundingBoxFromZoom();
  }

  panToOffCenter(latlng, offset, options) {
    const x = latlng.containerPoint.x + offset[0],
      y = latlng.containerPoint.y - offset[1],
      currentZoom = this.map._zoom,
      newLatlng = this.map.containerPointToLatLng([x, y]);

    return this.map.setView(newLatlng, currentZoom, { pan: options });
  }

  zoomFullMap() {
    const { zoomFullMap, fullMapZoomHandler } = this.props;
    if (zoomFullMap) {
      this.map.setView([10, 170], 3);
      fullMapZoomHandler(false);
    }
  }

  zoomToSelectedSite() {
    const { highlightMarker, zoomToSite, zoomToSiteHandler } = this.props;
    if (zoomToSite && highlightMarker) {
      const markerLatlng = highlightMarker._latlng;
      this.map.setView([markerLatlng.lat, markerLatlng.lng], 16);
      zoomToSiteHandler(false);
    }
  }

  //returns a stringified number similar to toFixed
  toFixedNoRounding(number, n) {
    const regToSetSignificant = new RegExp('^-?\\d+(?:\\.\\d{0,' + n + '})?', 'g');
    const a = number.toString().match(regToSetSignificant)[0];
    const dot = a.indexOf('.');
    if (dot === -1) {
      return a + '.' + '0'.repeat(n);
    }
    const b = n - (a.length - dot) + 1;
    return b > 0 ? a + '0'.repeat(b) : a;
  }

  checkSameSiteInACluster(arr) {
    //check sites in cluster by their coordinates and names
    const markersArr = arr.map(item => {
      return item.options.marker;
    });

    const coordinatesArr = markersArr.map(({ geometry }) => {
      const latStr = `${this.toFixedNoRounding(geometry.coordinates[0], 3)}`;
      const lngStr = `${this.toFixedNoRounding(geometry.coordinates[1], 3)}`;
      return `${latStr},${lngStr}`;
    });
    const siteNamesArr = markersArr.map(({ properties }) => properties.site_name);

    const coordinatesSizeResult = new Set(coordinatesArr).size === 1;
    const siteNamesSizeResult = new Set(siteNamesArr).size === 1;

    //if all sites property are the same (equals to 1), return true
    return coordinatesSizeResult && siteNamesSizeResult;
  }

  checkSimilarBoundingBox(box1, box2) {
    const boxLat1 = box1 && box1.lat;
    const boxLat2 = box2 && box2.lat;
    if (boxLat1 === boxLat2) {
      return true;
    }
    return false;
  }

  createBoundingBox(boundingBox) {
    const south = boundingBox.getSouth(),
      west = boundingBox.getWest(),
      north = boundingBox.getNorth(),
      east = boundingBox.getEast();
    const swArr = [west, south];
    const seArr = [east, south];
    const neArr = [east, north];
    const nwArr = [west, north];
    const bbox = [swArr, seArr, neArr, nwArr, swArr];
    return bbox;
  }

  updateBoundingBoxFromZoom() {
    const { mapZoomLevel } = this.state;
    const { getMapBounds, contentLoadHandler } = this.props;

    this.map.once('zoomend', e => {
      const currBounds = e.target.getBounds();
      const currZoom = e.target.getZoom();
      const currBbox = this.createBoundingBox(currBounds);
      const zoomDiff = mapZoomLevel - currZoom;
      if (zoomDiff !== 0) {
        this.setState({ mapZoomLevel: currZoom });
        getMapBounds(currBbox);
      }
      contentLoadHandler(true);
    });
  }

  updateBoundingBoxFromPan() {
    const { mapBoundingBoxCorner } = this.state;
    const { getMapBounds, contentLoadHandler } = this.props;

    this.map.once('dragend', e => {
      const currBounds = e.target.getBounds();
      const southBound = currBounds.getSouth();
      const currBbox = this.createBoundingBox(currBounds);
      const viewDiff = mapBoundingBoxCorner.toFixed(5) - southBound.toFixed(5);
      if (viewDiff !== 0) {
        this.setState({ mapBoundingBoxCorner: southBound });
        getMapBounds(currBbox);
      }
      contentLoadHandler(true);
    });
  }

  createCluster(style_property) {
    const { radius, padding, margin, color, pulseEffect } = style_property;
    const selectMarkerCluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: false,
      iconCreateFunction: function(cluster) {
        const childCount = cluster.getChildCount();
        const clusterStyle = generateClusterIconStyle({
          baseRadius: radius,
          basePadding: padding,
          margin: margin,
          numberMarkers: childCount,
          defaultMarkerColor: color,
          setPulseAnimation: pulseEffect
        });

        return new L.DivIcon({
          html: `<div style="${clusterStyle}"><span style="${
            leafletProperty.clusterIconNumberStyles
          }"> ${childCount} </span></div>`,
          className: 'marker-cluster-icon'
        });
      }
    });

    return selectMarkerCluster;
  }

  updateMarkers(markersData) {
    const {
      siteClickHandler,
      fullMapZoomHandler,
      siteDropDownHandler,
      sitesDropDownToggle,
      removeHighlight,
      setIconActive,
      removeHighlightCluster,
      setClusterActive
    } = this.props;
    const allClusterStyle = {
      radius: 10,
      padding: 10,
      margin: 5,
      color: leafletProperty.defaultMarkerColor
    };

    const markersCluster = this.createCluster(allClusterStyle);

    markersCluster.on('clusterclick', e => {
      const markerCluster = e.layer.getAllChildMarkers();
      const selectedClusterStyle = {
        radius: 10,
        padding: 20,
        margin: 0,
        color: leafletProperty.selectedMarkerColor,
        pulseEffect: true
      };
      const currentZoom = e.layer._zoom;

      //Check max zoom and use checkSameSiteInACluster function helps identify the similar sites in a cluster
      if (currentZoom === mapProperty.maxZoom || this.checkSameSiteInACluster(markerCluster)) {
        const markersData = markerCluster.map(item => {
          return item.options.marker;
        });
        removeHighlight();
        siteDropDownHandler(markersData);

        const selectedMarkersCluster = this.createCluster(selectedClusterStyle);

        markerCluster.forEach(selectMaker => {
          selectedMarkersCluster.addLayer(selectMaker);
        });
        removeHighlightCluster();
        setClusterActive(selectedMarkersCluster);
        this.map.addLayer(selectedMarkersCluster);
      }

      fullMapZoomHandler(false);
    });

    markersData.forEach(marker => {
      const markerPoint = L.marker(
        [marker.geometry.coordinates[1], marker.geometry.coordinates[0]],
        { icon: leafletProperty.icon, marker }
      );
      markerPoint._leaflet_id = marker.id;

      markersCluster.addLayer(
        markerPoint.on('click', e => {
          const responsiveOffSetX = offsetX(windowWidth());
          removeHighlight();
          setIconActive(markerPoint);
          siteClickHandler(marker);
          sitesDropDownToggle(false);
          this.panToOffCenter(e, [responsiveOffSetX, 0], { animate: true });
        })
      );
    });

    this.map.addLayer(markersCluster);
  }

  render() {
    return (
      <MapContainer open={this.props.open}>
        <MapFrame>
          <Wrapper id="map" />
        </MapFrame>
      </MapContainer>
    );
  }
}
export default LeafletMap;
