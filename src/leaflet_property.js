import L from 'leaflet';

export const defaultMarkerColor = '#A53434';
export const selectedMarkerColor = '#FF6347';

export const markerHtmlStyles = `
  background-color: ${defaultMarkerColor};
  width: 1rem;
  height: 1rem;
  display: block;
  position: relative;
  border-radius: 1.5rem;
  border: 1px solid #FFFFFF`;

export const activeMarkerHtmlStyles = `
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

export const activeInnerMarkerHtmlStyles = `
  position: absolute;
  content: '';
  width: 0px;
  height: 0px;
  bottom: -26px;
  left: -3px;
  border: 8px solid transparent;
  border-top: 15px solid ${defaultMarkerColor};
`;

export const icon = L.divIcon({
  className: 'my-default-pin',
  html: `<div style="${markerHtmlStyles}" />`
});

export const activeIcon = L.divIcon({
  className: 'my-active-pin',
  html: `
    <div style="${activeMarkerHtmlStyles}">
      <div style="${activeInnerMarkerHtmlStyles}">
        </div>
      </div>
    </div>`
});

export const clusterIconNumberStyles = `
  color: white;
  font-size: 14px;
`;
