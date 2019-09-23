const color = {
  mermaidDark: '#2C3742',
  mermaidWhite: 'white',
  mermaidBlue: '#468DAE',
  mermaidBlack: 'black',
  mermaidNotAllowed: '#9C9C9C',
  mermaidQuiteGray: 'rgba(0,0,0,0.2)',
  mermaidGray: '#585858'
};

export const theme = {
  backButton: {
    color: color.mermaidDark,
    bgColor: color.mermaidWhite,
    width: '65px',
    height: '65px',
    padding: '5px',
    flexDirection: 'column',
    initialTranslate: 'translate(0%)',
    hoverTranslate: 'translate(-5%, 0%)'
  },
  cardButton: {
    color: color.mermaidWhite,
    bgColor: color.mermaidBlue,
    notAllowedBgColor: color.mermaidNotAllowed,
    flexDirection: 'row',
    padding: '10px'
  },
  mapControl: {
    color: color.mermaidGray,
    bgColor: color.mermaidWhite,
    borderColor: color.mermaidQuiteGray,
    position: 'fixed',
    padding: '0',
    width: '32px',
    height: '32px'
  }
};
