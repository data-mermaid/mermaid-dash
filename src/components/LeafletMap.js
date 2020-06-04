import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-minimap';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import '../lib/leaflet-tilelayer-subpixel-fix';
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
  center: [-2, 0],
  zoom: 2,
  minZoom: 2,
  maxZoom: 16,
  zoomControl: true,
  worldCopyJump: false,
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
    mapZoomLevel: null,
    mapBoundingBoxCorner: null,
    mapBounds: null,
    siteCenterChange: false,
    popUpList: [],
    miniMap: null
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      markersData: prevMarkersData,
      sidePanelOpen: prevSidePanelOpen,
      siteDetail: prevSiteDetail,
      zoomFullMap: prevZoomFullMap,
      zoomToSite: prevZoomToSite
    } = prevProps;

    const {
      markersData,
      sidePanelOpen,
      siteDetail,
      popupOpen,
      mobileDisplay,
      zoomFullMap,
      zoomToSite
    } = this.props;

    const {
      mapZoomLevel: prevMapZoomLevel,
      mapBoundingBoxCorner: prevMapBoundingBoxCorner
    } = prevState;

    const { mapZoomLevel, mapBoundingBoxCorner, popUpList, miniMap, mapBounds } = this.state;
    const prevSiteDetailId = prevSiteDetail && prevSiteDetail.id;
    const siteDetailId = siteDetail && siteDetail.id;

    if (markersData !== prevMarkersData) {
      this.updateMarkers(markersData);
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
      if (mobileDisplay) {
        miniMap.remove();
      } else {
        miniMap.addTo(this.map);
      }
    }

    if (zoomFullMap !== prevZoomFullMap) {
      this.zoomFullMap();
    }

    if (zoomToSite !== prevZoomToSite) {
      this.zoomToSelectedSite();
    }
  }

  componentDidMount() {
    this.map = L.map('map', mapProperty);
    const { mobileDisplay } = this.props;
    const miniMapControl = new L.Control.MiniMap(miniMapLayer, miniMapProperty);

    if (!mobileDisplay) {
      miniMapControl.addTo(this.map);
    }

    this.setState({
      miniMap: miniMapControl
    });
  }

  //Control re-rendering of component for only certain actions
  shouldComponentUpdate(nextProps, nextStates) {
    const { markersData, sidePanelOpen, zoomFullMap, zoomToSite, siteDetail } = this.props;
    const { mapZoomLevel, mapBoundingBoxCorner } = this.state;
    const siteDetailId = siteDetail && siteDetail.id;
    const nextSiteDetailId = nextProps.siteDetail && nextProps.siteDetail.id;

    if (
      nextProps.markersData !== markersData ||
      nextStates.mapZoomLevel !== mapZoomLevel ||
      nextStates.mapBoundingBoxCorner !== mapBoundingBoxCorner ||
      nextProps.sidePanelOpen !== sidePanelOpen ||
      nextSiteDetailId !== siteDetailId ||
      nextProps.zoomFullMap !== zoomFullMap ||
      nextProps.zoomToSite !== zoomToSite
    ) {
      return true;
    }

    return false;
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
    //Zoom to initial load marker cluster.
    const { zoomFullMap, fullMapZoomHandler, getMapBounds } = this.props;
    const { mapBounds } = this.state;

    if (zoomFullMap) {
      if (mapBounds) {
        const bbox = this.createBoundingBox(mapBounds);
        this.map.fitBounds(mapBounds);
        fullMapZoomHandler(false);
        this.map.closePopup();
        getMapBounds(bbox);
      } else {
        this.map.setView(mapProperty.center, mapProperty.zoom);
      }
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

  splitWestEast(w, e) {
    const { mapBounds } = this.state;
    const maxBounds = mapBounds && mapBounds.getEast();
    const minBounds = mapBounds && mapBounds.getWest();
    const eastSide = maxBounds || e;

    if (mapBounds && (e < minBounds || w > maxBounds)) {
      // Out of bounds case
      return [[]];
    } else if (eastSide < 180) {
      // When all markers initially load and locates on the east where it is < 180 degree
      return [[w, e]];
    } else if (eastSide > 180) {
      // When all markers initially load and locates on the east where it is > 180 degree
      if (w > 180) {
        // Markers west and east are > 180, example: Belize.
        return [[w - 360, eastSide - 360]];
      } else if (minBounds && w < minBounds) {
        // When map is moving to west (left) side
        if (e < 180) {
          // Markers west and east stay between minBounds and east
          return [[minBounds, e]];
        }
        return [[minBounds, 180], [-180, e - 360]];
      } else if (w > 0 && e < 180) {
        // Markers west and east stay between 0 and 180. example: Indonesia
        return [[w, e]];
      }
      return [[w, 180], [-180, eastSide - 360]]; // When map is moving to east (right) side
    }
  }

  buildBbox(n, e, s, w) {
    const swBound = [w, s];
    const seBound = [e, s];
    const neBound = [e, n];
    const nwBound = [w, n];

    return [[swBound, seBound, neBound, nwBound, swBound]];
  }

  createBoundingBox(boundingBox) {
    const north = boundingBox.getNorth();
    const east = boundingBox.getEast();
    const south = boundingBox.getSouth();
    const west = boundingBox.getWest();

    const bbox = this.splitWestEast(west, east).map(bound => {
      return this.buildBbox(north, bound[1], south, bound[0]);
    });

    return bbox;
  }

  updateBoundingBoxFromZoom() {
    const { getMapBounds, contentLoadHandler } = this.props;

    this.map.once('zoomstart', e => {
      contentLoadHandler(true);
    });

    this.map.once('zoomend', e => {
      const currBounds = e.target.getBounds();
      const currZoom = e.target.getZoom();
      const currBbox = this.createBoundingBox(currBounds);

      if (this.state.mapZoomLevel === currZoom) {
        this.setState({ mapZoomLevel: currZoom + 1 });
        contentLoadHandler(false);
      } else {
        this.setState({ mapZoomLevel: currZoom });
        getMapBounds(currBbox);
      }
    });
  }

  updateBoundingBoxFromPan() {
    const { mapBoundingBoxCorner } = this.state;
    const { getMapBounds, contentLoadHandler } = this.props;

    this.map.once('dragstart', e => {
      contentLoadHandler(true);
    });

    this.map.once('dragend', e => {
      const currBounds = e.target.getBounds();
      const southBound = currBounds.getSouth();
      const currBbox = this.createBoundingBox(currBounds);

      setTimeout(() => {
        if (mapBoundingBoxCorner === southBound) {
          this.setState({ mapBoundingBoxCorner: southBound + 0.1 });
          contentLoadHandler(false);
        } else {
          this.setState({ mapBoundingBoxCorner: southBound });
          getMapBounds(currBbox);
        }
      }, 750);
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
      setClusterActive,
      getMapBounds
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
      const markerLatitude = marker.geometry.coordinates[1];
      const markerLongitude = L.Util.wrapNum(marker.geometry.coordinates[0], [0, 360], true); //Wrap longitude from [-180, 180] to [0, 360]

      const markerPoint = L.marker([markerLatitude, markerLongitude], {
        icon: leafletProperty.icon,
        marker
      });

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

    if (markersData.length === 0) {
      this.map.setView(mapProperty.center, mapProperty.zoom);
    } else {
      const mapBounds = markersCluster.getBounds().pad(0.1);
      const mapBoundingBox = this.createBoundingBox(mapBounds);
      const mapBoundingBoxCorner = mapBounds.getSouth();

      this.setState({
        mapZoomLevel: this.map.getZoom(),
        mapCenterLevel: markersCluster.getBounds().getCenter(),
        mapBoundingBoxCorner: mapBoundingBoxCorner,
        mapBounds: mapBounds
      });

      this.map.fitBounds(mapBounds);
      getMapBounds(mapBoundingBox);
    }
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
