/* eslint-disable global-require */
/* eslint-disable no-else-return */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components/macro'
import L from 'leaflet'
import 'leaflet-minimap'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'
import '../lib/leaflet-tilelayer-subpixel-fix'
import * as leafletProperty from '../constants/leaflet-properties'
import { siteDetailPropType, sitesPropType } from '../lib/mermaidDataPropTypes'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

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
`

const MapStyle = styled.div`
  height: calc(100vh - 49px);
`

const generateClusterIconStyle = ({
  baseRadius,
  basePadding,
  margin,
  numberMarkers,
  defaultMarkerColor,
  setPulseAnimation,
}) => {
  const radius = String(numberMarkers).length * baseRadius + basePadding

  let backgroundColor

  switch (numberMarkers.length) {
    case 1:
      backgroundColor = 'red'
      break
    case 2:
      backgroundColor = 'yellow'
      break
    default:
      backgroundColor = defaultMarkerColor
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
  `
}

const miniMapLayer = L.tileLayer(
  'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
)

const worldImageryMapLayer = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution: 'Tiles &copy; Esri',
  },
)

const labelLayer = L.tileLayer(
  'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
)

const mapProperty = {
  center: [-2, 0],
  zoom: 2,
  minZoom: 2,
  maxZoom: 17,
  zoomControl: true,
  worldCopyJump: false,
  layers: [worldImageryMapLayer, labelLayer],
}

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
    fillOpacity: 0,
  },
  zoomLevelOffset: -7,
}

class LeafletMap extends Component {
  state = {
    mapZoomLevel: null,
    mapBoundingBoxCorner: null,
    mapBounds: null,
    siteCenterChange: false,
    popUpList: [],
    miniMap: null,
  }

  componentDidMount() {
    this.map = L.map('map', mapProperty)
    const { mobileDisplay } = this.props
    const miniMap = new L.Control.MiniMap(miniMapLayer, miniMapProperty)

    if (!mobileDisplay) miniMap.addTo(this.map)

    this.setState({
      miniMap,
    })
  }

  // Control re-rendering of component for only certain actions
  shouldComponentUpdate(nextProps, nextStates) {
    const { markersData, sidePanelOpen, zoomFullMap, zoomToSite, siteDetail } = this.props
    const { mapZoomLevel, mapBoundingBoxCorner } = this.state
    const siteDetailId = siteDetail && siteDetail[0].site_id
    const nextSiteDetailId = nextProps.siteDetail && nextProps.siteDetail[0].site_id

    return (
      nextProps.markersData !== markersData ||
      nextStates.mapZoomLevel !== mapZoomLevel ||
      nextStates.mapBoundingBoxCorner !== mapBoundingBoxCorner ||
      nextProps.sidePanelOpen !== sidePanelOpen ||
      nextSiteDetailId !== siteDetailId ||
      nextProps.zoomFullMap !== zoomFullMap ||
      nextProps.zoomToSite !== zoomToSite
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      markersData: prevMarkersData,
      sidePanelOpen: prevSidePanelOpen,
      siteDetail: prevSiteDetail,
      zoomFullMap: prevZoomFullMap,
      zoomToSite: prevZoomToSite,
    } = prevProps

    const {
      markersData,
      sidePanelOpen,
      siteDetail,
      popupOpen,
      mobileDisplay,
      zoomFullMap,
      zoomToSite,
    } = this.props

    const {
      mapZoomLevel: prevMapZoomLevel,
      mapBoundingBoxCorner: prevMapBoundingBoxCorner,
    } = prevState

    const { mapZoomLevel, mapBoundingBoxCorner, popUpList, miniMap } = this.state
    const prevSiteDetailId = prevSiteDetail && prevSiteDetail[0].site_id
    const siteDetailId = siteDetail && siteDetail[0].site_id

    if (markersData !== prevMarkersData) this.updateMarkers(markersData)

    if (mapZoomLevel !== prevMapZoomLevel) this.updateBoundingBoxFromZoom()

    if (mapBoundingBoxCorner !== prevMapBoundingBoxCorner) this.updateBoundingBoxFromPan()

    // Redraw leaflet map when dashboard is open or close
    if (sidePanelOpen !== prevSidePanelOpen) this.updateBoundingBoxMapResize()

    // Reset when selected site view is set to center
    if (!sidePanelOpen && sidePanelOpen !== prevSidePanelOpen)
      this.setState({ siteCenterChange: true })

    if (siteDetail === null && prevSiteDetailId) this.map.closePopup()

    if (popupOpen && siteDetailId !== prevSiteDetailId) {
      this.#popupHighlightSelect(popUpList, siteDetailId)
    }

    if (miniMap !== null) {
      if (mobileDisplay) miniMap.remove()
      else miniMap.addTo(this.map)
    }

    if (zoomFullMap !== prevZoomFullMap) this.zoomFullMap()

    if (zoomToSite !== prevZoomToSite) this.zoomToSelectedSite()
  }

  // Returns a stringified number similar to toFixed
  #toFixedNoRounding = function toFixedNoRounding(number, n) {
    const regToSetSignificant = new RegExp('^-?\\d+(?:\\.\\d{0,' + n + '})?', 'g') // eslint-disable-line prefer-template
    const a = number.toString().match(regToSetSignificant)[0]
    const dot = a.indexOf('.')
    const b = n - (a.length - dot) + 1

    if (dot === -1) return `${a}.${'0'.repeat(n)}`

    return b > 0 ? a + '0'.repeat(b) : a
  }

  #buildBbox = function buildBbox(n, e, s, w) {
    const swBound = [w, s]
    const seBound = [e, s]
    const neBound = [e, n]
    const nwBound = [w, n]

    return [[swBound, seBound, neBound, nwBound, swBound]]
  }

  #createCluster = function createCluster(style_property) {
    const { radius, padding, margin, color, pulseEffect } = style_property
    const selectMarkerCluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: false,
      iconCreateFunction: cluster => {
        const childCount = cluster.getChildCount()
        const clusterStyle = generateClusterIconStyle({
          baseRadius: radius,
          basePadding: padding,
          margin: margin,
          numberMarkers: childCount,
          defaultMarkerColor: color,
          setPulseAnimation: pulseEffect,
        })

        return new L.DivIcon({
          html: `<div style="${clusterStyle}"><span style="${leafletProperty.clusterIconNumberStyles}"> ${childCount} </span></div>`,
          className: 'marker-cluster-icon',
        })
      },
    })

    return selectMarkerCluster
  }

  #countClusterPopupChar = function countClusterPopupChar(clusterArray) {
    return clusterArray.map(item => `${item.site_name} - ${item.project_name}`)
  }

  #popupHighlightSelect = function popupHighlightSelect(popupContent, siteHighlight) {
    for (const elem of popupContent) {
      elem.classList.remove('active')
    }

    const findSiteId = document.getElementById(`${siteHighlight}`)

    if (findSiteId) findSiteId.classList.add('active')
  }

  // Use case: For when user selects site when side panel is closed. Panel
  // Will slide in, and will adjust the center when the site is pushed left
  recenterView(zoom) {
    const { sidePanelOpen, siteDetail } = this.props
    const { siteCenterChange } = this.state

    if (sidePanelOpen && siteDetail[0] && siteCenterChange) {
      const { latitude, longitude } = siteDetail[0]
      const longitudeWithinRange = longitude >= 0 && longitude <= 180 ? longitude : 360 + longitude
      const siteLatLng = [latitude, longitudeWithinRange]

      this.map.setView(siteLatLng, zoom)
      this.setState({ siteCenterChange: false })
    }
  }

  panToCenter(latlng, options) {
    const { x, y } = latlng.containerPoint
    const currentZoom = this.map._zoom
    const newLatlng = this.map.containerPointToLatLng([x, y])

    this.map.setView(newLatlng, currentZoom, { pan: options })
    this.recenterView(currentZoom)
  }

  zoomFullMap() {
    // Zoom to initial load marker cluster.
    const { zoomFullMap, fullMapZoomHandler, getMapBounds } = this.props
    const { mapBounds } = this.state

    if (zoomFullMap) {
      if (mapBounds) {
        const bbox = mapBounds

        this.map.fitBounds(mapBounds)
        fullMapZoomHandler(false)
        this.map.closePopup()
        getMapBounds(bbox)
      } else this.map.setView(mapProperty.center, mapProperty.zoom)
    }
  }

  zoomToSelectedSite() {
    const { highlightMarker, zoomToSite, zoomToSiteHandler } = this.props

    if (zoomToSite && highlightMarker) {
      const markerLatlng = highlightMarker._latlng

      this.map.setView([markerLatlng.lat, markerLatlng.lng], 16)
      zoomToSiteHandler(false)
    }
  }

  checkSameSiteInACluster(arr) {
    // Check sites in cluster by their coordinates and names
    const markersArr = arr.map(item => item.options.marker)

    const coordinatesArr = markersArr.map(marker => {
      const { latitude, longitude } = marker[1][0]
      const latStr = `${this.#toFixedNoRounding(latitude, 3)}`
      const lngStr = `${this.#toFixedNoRounding(longitude, 3)}`

      return `${latStr},${lngStr}`
    })
    const siteNamesArr = markersArr.map(({ site_name }) => site_name)

    const coordinatesSizeResult = new Set(coordinatesArr).size === 1
    const siteNamesSizeResult = new Set(siteNamesArr).size === 1

    // If all sites property are the same (equals to 1), return true
    return coordinatesSizeResult && siteNamesSizeResult
  }

  updateBoundingBoxFromZoom() {
    const { getMapBounds, contentLoadHandler } = this.props
    const { mapZoomLevel } = this.state

    this.map.once('zoomstart', () => contentLoadHandler(true))

    this.map.once('zoomend', e => {
      const curBounds = e.target.getBounds()
      const curZoom = e.target.getZoom()

      if (mapZoomLevel === curZoom) {
        this.setState({ mapZoomLevel: curZoom + 1 })
        contentLoadHandler(false)
      } else {
        this.setState({ mapZoomLevel: curZoom })
        getMapBounds(curBounds)
      }
    })
  }

  updateBoundingBoxFromPan() {
    const { mapBoundingBoxCorner } = this.state
    const { getMapBounds, contentLoadHandler } = this.props

    this.map.once('dragstart', () => contentLoadHandler(true))

    this.map.once('dragend', e => {
      const curBounds = e.target.getBounds()
      const southBound = curBounds.getSouth()

      setTimeout(() => {
        if (mapBoundingBoxCorner === southBound) {
          this.setState({ mapBoundingBoxCorner: southBound + 0.1 })
          contentLoadHandler(false)
        } else {
          this.setState({ mapBoundingBoxCorner: southBound })
          getMapBounds(curBounds)
        }
      }, 750)
    })
  }

  updateBoundingBoxMapResize() {
    const { mapBoundingBoxCorner } = this.state
    const { getMapBounds, contentLoadHandler } = this.props

    this.map.invalidateSize()

    const curBounds = this.map.getBounds()
    const southBound = curBounds.getSouth()

    if (mapBoundingBoxCorner === southBound) {
      this.setState({ mapBoundingBoxCorner: southBound + 0.1 })
      contentLoadHandler(false)
    } else {
      this.setState({ mapBoundingBoxCorner: southBound })
      getMapBounds(curBounds)
    }
  }

  createPopup(markersData, coordinates) {
    const popUpContentStyles =
      markersData.length >= 10 || this.#countClusterPopupChar(markersData) >= 450
        ? leafletProperty.popUpHigherStyles
        : leafletProperty.popUpDefaultStyles

    const popUpArray = markersData.map((item, index) => {
      const itemStyle =
        index === markersData.length - 1
          ? leafletProperty.popUpContentLastItemStyles
          : leafletProperty.popUpContentItemStyles

      const siteId = item[0]
      const { site_name, project_name } = item[1][0]

      return `
            <div style="${itemStyle}" id="${siteId}" class="popup-cluster-site">
              ${site_name} - ${project_name}
            </div>`
    })

    return L.popup().setLatLng(coordinates).setContent(`
      <div style="${popUpContentStyles}">
        ${popUpArray.join('')}
      </div>
      `)
  }

  popupClickHandler(popupCluster, markersData) {
    popupCluster.openOn(this.map)
    const { siteClickHandler } = this.props

    const el = popupCluster.getElement().children[0].children[0].children[0].children
    const handleInteraction = ({ target }) => {
      const resultMarker = markersData.filter(site => site[0] === target.id)[0]

      siteClickHandler(resultMarker)
    }

    for (const i of el) {
      i.addEventListener('touchstart', handleInteraction)
      i.addEventListener('click', handleInteraction)
    }

    const popUpListItem = document.getElementsByClassName('popup-cluster-site')

    this.setState({ popUpList: popUpListItem })
  }

  updateMarkers(markersData) {
    const {
      siteClickHandler,
      fullMapZoomHandler,
      siteDropDownHandler,
      removeHighlight,
      setIconActive,
      removeHighlightCluster,
      setClusterActive,
      getMapBounds,
    } = this.props

    const allClusterStyle = {
      radius: 10,
      padding: 10,
      margin: 5,
      color: leafletProperty.defaultMarkerColor,
    }

    const markersCluster = this.#createCluster(allClusterStyle)

    markersCluster.on('clusterclick', e => {
      const markerCluster = e.layer.getAllChildMarkers()
      const currentZoom = e.layer._zoom
      const clusterCoordinates = e.layer.getLatLng()
      const selectedClusterStyle = {
        radius: 10,
        padding: 20,
        margin: 0,
        color: leafletProperty.selectedMarkerColor,
        pulseEffect: true,
      }

      // Check max zoom and use checkSameSiteInACluster function helps identify the similar sites in a cluster
      if (currentZoom === mapProperty.maxZoom || this.checkSameSiteInACluster(markerCluster)) {
        const selectedMarkersCluster = this.#createCluster(selectedClusterStyle)
        const markersClusterData = markerCluster.map(item => item.options.marker)
        const popUpCluster = this.createPopup(markersClusterData, clusterCoordinates)

        this.popupClickHandler(popUpCluster, markersClusterData)

        markerCluster.forEach(selectMaker => {
          selectedMarkersCluster.addLayer(selectMaker)
          selectedMarkersCluster.on('clusterclick', () => {
            const { popUpList } = this.state
            const { siteDetail } = this.props
            const siteDetailId = siteDetail && siteDetail[0].site_id

            this.popupClickHandler(popUpCluster, markersClusterData)
            this.#popupHighlightSelect(popUpList, siteDetailId)
          })
        })

        removeHighlight()
        removeHighlightCluster()
        setClusterActive(selectedMarkersCluster)
        siteDropDownHandler(markersClusterData)

        this.recenterView(currentZoom)
        this.map.addLayer(selectedMarkersCluster)
      }

      fullMapZoomHandler(false)
    })

    markersData.forEach(marker => {
      const [markerId, markerInfo] = marker
      const markerLatitude = markerInfo[0].latitude
      const markerLongitude = L.Util.wrapNum(markerInfo[0].longitude, [0, 360], true) // Wrap longitude from [-180, 180] to [0, 360]

      const markerPoint = L.marker([markerLatitude, markerLongitude], {
        icon: leafletProperty.icon,
        marker,
      })

      markerPoint._leaflet_id = markerId
      markersCluster.addLayer(
        markerPoint.on('click', e => {
          removeHighlight()
          removeHighlightCluster()
          setIconActive(markerPoint)
          siteClickHandler(marker)
          this.panToCenter(e, { animate: true })
        }),
      )
    })

    if (markersData.length === 0) {
      this.map.setView(mapProperty.center, mapProperty.zoom)
    } else {
      const markerBounds = markersCluster.getBounds()

      this.map.fitBounds(markerBounds)

      const mapBounds = this.map.getBounds()
      const mapBoundingBoxCorner = mapBounds.getSouth()

      this.setState({
        mapZoomLevel: this.map.getZoom(),
        mapBoundingBoxCorner,
        mapBounds,
      })

      getMapBounds(mapBounds)
    }

    this.map.addLayer(markersCluster)
  }

  render() {
    const { sidePanelOpen } = this.props

    return (
      <MapContainer sidePanelOpen={sidePanelOpen}>
        <MapStyle id="map" />
      </MapContainer>
    )
  }
}

LeafletMap.propTypes = {
  markersData: sitesPropType.isRequired,
  sidePanelOpen: PropTypes.bool.isRequired,
  zoomFullMap: PropTypes.bool.isRequired,
  zoomToSite: PropTypes.bool.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  popupOpen: PropTypes.bool.isRequired,
  siteDetail: PropTypes.arrayOf(siteDetailPropType),
  fullMapZoomHandler: PropTypes.func.isRequired,
  getMapBounds: PropTypes.func.isRequired,
  zoomToSiteHandler: PropTypes.func.isRequired,
  siteClickHandler: PropTypes.func.isRequired,
  siteDropDownHandler: PropTypes.func.isRequired,
  removeHighlight: PropTypes.func.isRequired,
  removeHighlightCluster: PropTypes.func.isRequired,
  setClusterActive: PropTypes.func.isRequired,
  setIconActive: PropTypes.func.isRequired,
  contentLoadHandler: PropTypes.func.isRequired,
  highlightMarker: PropTypes.shape({
    _latlng: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
  }),
}

LeafletMap.defaultProps = {
  siteDetail: [],
  highlightMarker: {},
}

export default LeafletMap
