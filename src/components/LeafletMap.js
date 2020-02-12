import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-minimap';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import * as leafletProperty from '../constants/leaflet-properties';
import styled from 'styled-components/macro';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  margin-top: 49px;
  padding-right: ${props => (props.sidePanelOpen ? '650px' : '0px')};

  @media (min-width: 0px) {
    padding-right: ${props => (props.sidePanelOpen ? '350px' : '0px')};
  }
  @media (min-width: 960px) {
    padding-right: ${props => (props.sidePanelOpen ? '500px' : '0px')};
  }
  @media (min-width: 1280px) {
    padding-right: ${props => (props.sidePanelOpen ? '650px' : '0px')};
  }
`;

const Wrapper = styled.div`
  height: calc(100vh - 49px);
`;

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
      attribution: 'Tiles &copy; Esri'
    }
  ),
  labelLayer = L.tileLayer(
    'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x} '
  );

const mapProperty = {
  center: [-20, 100],
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
    mapBoundingBoxCorner: null,
    siteCenterChange: false,
    popUpList: [],
    hideMiniMap: false,
    miniMap: null
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      markersData: prevMarkersData,
      sidePanelOpen: prevSidePanelOpen,
      siteDetail: prevSiteDetail
    } = prevProps;
    const { markersData, sidePanelOpen, siteDetail, popupOpen, hideMiniMap } = this.props;
    const {
      mapZoomLevel: prevMapZoomLevel,
      mapBoundingBoxCorner: prevMapBoundingBoxCorner
    } = prevState;
    const { mapZoomLevel, mapBoundingBoxCorner, popUpList, miniMap } = this.state;
    const prevSiteDetailId = prevSiteDetail && prevSiteDetail.id;
    const siteDetailId = siteDetail && siteDetail.id;

    if (markersData !== prevMarkersData) {
      this.updateMarkers(this.props.markersData);
    }

    if (mapZoomLevel !== prevMapZoomLevel) {
      this.updateBoundingBoxFromZoom();
    }

    if (mapBoundingBoxCorner !== prevMapBoundingBoxCorner) {
      this.updateBoundingBoxFromPan();
    }

    //redraw leaflet map when dashboard is open or close
    if (sidePanelOpen !== prevSidePanelOpen) {
      this.map.invalidateSize();
    }

    //reset when selected site view is set to center
    if (!sidePanelOpen && sidePanelOpen !== prevSidePanelOpen) {
      this.setState({ siteCenterChange: true });
    }

    if (siteDetail === null && prevSiteDetailId) {
      this.map.closePopup();
    }
    if (popupOpen && siteDetailId !== prevSiteDetailId) {
      this.popupHighlightSelect(popUpList, siteDetailId);
    }
    if (miniMap !== null) {
      if (hideMiniMap) {
        miniMap.remove();
      } else if (!hideMiniMap) {
        miniMap.addTo(this.map);
      }
    }

    this.zoomToSelectedSite();
    this.zoomFullMap();
  }

  componentDidMount() {
    this.map = L.map('map', mapProperty);
    const { hideMiniMap } = this.props;
    const miniMapControl = new L.Control.MiniMap(miniMapLayer, miniMapProperty);
    const initMapBounds = this.map.getBounds();
    const initBbox = this.createBoundingBox(initMapBounds);
    const initSouthBbox = initMapBounds.getSouth();

    if (hideMiniMap) {
      miniMapControl.addTo(this.map);
    }

    this.setState({
      mapZoomLevel: this.map.getZoom(),
      mapBoundingBoxCorner: initSouthBbox,
      miniMap: miniMapControl
    });
    this.props.getMapBounds(initBbox);
    this.updateBoundingBoxFromZoom();
  }

  // use case: For when user selects site when side panel is closed. Panel
  // will slide in, and will adjust the center when the site is pushed left
  recenterView(zoom) {
    const { sidePanelOpen, siteDetail } = this.props;
    const { siteCenterChange } = this.state;

    if (sidePanelOpen && siteDetail && siteCenterChange) {
      const siteLatlng = [siteDetail.geometry.coordinates[1], siteDetail.geometry.coordinates[0]];
      this.map.setView(siteLatlng, zoom);
      this.setState({ siteCenterChange: false });
    }
  }

  panToCenter(latlng, options) {
    const x = latlng.containerPoint.x,
      y = latlng.containerPoint.y,
      currentZoom = this.map._zoom,
      newLatlng = this.map.containerPointToLatLng([x, y]);

    this.map.setView(newLatlng, currentZoom, { pan: options });
    this.recenterView(currentZoom);
  }

  zoomFullMap() {
    const { zoomFullMap, fullMapZoomHandler } = this.props;
    if (zoomFullMap) {
      this.map.setView([-20, 100], 3);
      fullMapZoomHandler(false);
      this.map.closePopup();
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

  countClusterPopupChar(clusterArray) {
    const clusterSiteNameArray = clusterArray.map(item => {
      return `${item.properties.site_name} - ${item.properties.project_name}`;
    });
    return clusterSiteNameArray.toString().length;
  }

  createPopup(markersData, coordinates) {
    const popUpContentStyles =
      markersData.length >= 10 || this.countClusterPopupChar(markersData) >= 450
        ? leafletProperty.popUpHigherStyles
        : leafletProperty.popUpDefaultStyles;

    const popUpArray = markersData.map((item, index) => {
      const itemStyle =
        index === markersData.length - 1
          ? leafletProperty.popUpContentLastItemStyles
          : leafletProperty.popUpContentItemStyles;

      return `
            <div style="${itemStyle}" id="${item.id}" class="popup-cluster-site">
              ${item.properties.site_name} - ${item.properties.project_name}
            </div>`;
    });

    const popup = L.popup().setLatLng(coordinates).setContent(`
      <div style="${popUpContentStyles}">
        ${popUpArray.join('')}
      </div>
  `);
    return popup;
  }

  popupClickHandler(popupCluster, markersData) {
    popupCluster.openOn(this.map);
    const { siteClickHandler } = this.props;
    const el = popupCluster.getElement().children[0].children[0].children[0].children;
    const handleInteraction = ({ target: { id: siteId } }) => {
      const resultMarker = markersData.filter(site => site.id === siteId)[0];
      siteClickHandler(resultMarker);
    };

    for (let i of el) {
      i.addEventListener('touchstart', handleInteraction);
      i.addEventListener('click', handleInteraction);
    }

    const elems = document.getElementsByClassName('popup-cluster-site');
    this.setState({ popUpList: elems });
  }

  popupHighlightSelect(popupContent, siteHighlight) {
    for (let elem of popupContent) {
      elem.classList.remove('active');
    }
    const findSiteId = document.getElementById(`${siteHighlight}`);
    findSiteId.classList.add('active');
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
      const currentZoom = e.layer._zoom;
      const clusterCoordinates = e.layer.getLatLng();
      const selectedClusterStyle = {
        radius: 10,
        padding: 20,
        margin: 0,
        color: leafletProperty.selectedMarkerColor,
        pulseEffect: true
      };

      //Check max zoom and use checkSameSiteInACluster function helps identify the similar sites in a cluster
      if (currentZoom === mapProperty.maxZoom || this.checkSameSiteInACluster(markerCluster)) {
        const selectedMarkersCluster = this.createCluster(selectedClusterStyle);
        const markersData = markerCluster.map(item => item.options.marker);
        const popUpCluster = this.createPopup(markersData, clusterCoordinates);

        this.popupClickHandler(popUpCluster, markersData);

        markerCluster.forEach(selectMaker => {
          selectedMarkersCluster.addLayer(selectMaker);
          selectedMarkersCluster.on('clusterclick', () => {
            const { popUpList } = this.state;
            const { siteDetail } = this.props;
            const siteDetailId = siteDetail && siteDetail.id;
            this.popupClickHandler(popUpCluster, markersData);
            this.popupHighlightSelect(popUpList, siteDetailId);
          });
        });

        removeHighlight();
        removeHighlightCluster();
        setClusterActive(selectedMarkersCluster);
        siteDropDownHandler(markersData);

        this.recenterView(currentZoom);
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
          removeHighlight();
          removeHighlightCluster();
          setIconActive(markerPoint);
          siteClickHandler(marker);
          sitesDropDownToggle(false);
          this.panToCenter(e, { animate: true });
        })
      );
    });

    this.map.addLayer(markersCluster);
  }

  render() {
    return (
      <MapContainer sidePanelOpen={this.props.sidePanelOpen}>
        <Wrapper id="map" />
      </MapContainer>
    );
  }
}
export default LeafletMap;
