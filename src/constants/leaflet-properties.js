import L from 'leaflet'

export const defaultMarkerColor = '#A53434'
export const selectedMarkerColor = '#FF6347'

export const markerHtmlStyles = `
  background-color: ${defaultMarkerColor};
  width: 1rem;
  height: 1rem;
  display: block;
  position: relative;
  border-radius: 1.5rem;
  border: 1px solid #FFFFFF`

export const activeMarkerHtmlStyles = `
  position: fixed;
  border-radius: 50%;
  top: -200%;
  border: 5px solid ${defaultMarkerColor};
  width: 1.5rem;
  height: 1.5rem;
  background-color: white;
  animation: bounce;
  animation-fill-mode: both;
  animation-duration: 0.5s;
`

export const activeInnerMarkerHtmlStyles = `
  position: absolute;
  content: '';
  width: 0px;
  height: 0px;
  bottom: -26px;
  left: -2px;
  border: 9px solid transparent;
  border-top: 16px solid ${defaultMarkerColor};
`

export const icon = L.divIcon({
  className: 'my-default-pin',
  html: `<div style="${markerHtmlStyles}" />`,
})

export const activeIcon = L.divIcon({
  className: 'my-active-pin',
  html: `
    <div style="${activeMarkerHtmlStyles}">
      <div style="${activeInnerMarkerHtmlStyles}">
        </div>
      </div>
    </div>`,
})

export const clusterIconNumberStyles = `
  color: white;
  font-size: 14px;
`

export const popUpDefaultStyles = `
  display: flex;
  flex-direction: column;
  height: auto;
  width: 300px;
`

export const popUpHigherStyles = `
  display: flex;
  flex-direction: column;
  height: 280px;
  width: 300px;
  overflow-y: overlay;
`

export const popUpContentItemStyles = `
  border-bottom: 1px solid;
  padding: 5px 5px 5px 0;
  cursor: pointer;
`
export const popUpContentLastItemStyles = `
  padding: 5px 5px 5px 0;
  cursor: pointer;
`

export const activeSelection = `
  font-weight: 900; !important
`
