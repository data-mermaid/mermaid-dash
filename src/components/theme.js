const color = {
  mermaidDark: '#2C3742',
  mermaidWhite: 'white',
  mermaidBlue: '#468DAE',
  mermaidBlack: 'black',
  mermaidNotAllowed: '#9C9C9C'
};

export const theme = {
  backButton: {
    color: color.mermaidDark,
    bgColor: color.mermaidWhite,
    position: 'fixed',
    width: '70px',
    padding: '5px',
    transition: '0.3s ease-out',
    transform: 'translate(-5%, 0%)',
    shadow:
      '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)'
  },
  cardButton: {
    color: color.mermaidWhite,
    bgColor: color.mermaidBlue,
    notAllowedBgColor: color.mermaidNotAllowed,
    width: '150px',
    padding: '1px',
    shadow:
      '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)'
  },
  fullZoom: {
    color: color.mermaidWhite,
    bgColor: color.mermaidBlack,
    position: 'fixed',
    width: '27px',
    padding: '2px'
  }
};
