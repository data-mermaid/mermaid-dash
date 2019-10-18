const color = {
  mermaidDark: '#2C3742',
  mermaidWhite: 'white',
  mermaidBlue: '#468DAE',
  mermaidBlack: 'black',
  mermaidNotAllowed: '#9C9C9C',
  mermaidGray: '#585858',
  mermaidWhiteGray: '#F4F4F4'
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
    borderColor: color.mermaidWhiteGray,
    padding: '0',
    width: '32px',
    height: '32px'
  },
  expandLessButton: {
    color: color.mermaidWhite,
    bgColor: 'transparent',
    padding: '0',
    width: '26px',
    height: '26px'
  },
  expandMoreButton: {
    color: color.mermaidDark,
    bgColor: 'transparent',
    padding: '0',
    width: '26px',
    height: '26px'
  },
  sidePanelControl: {
    color: color.mermaidGray,
    bgColor: color.mermaidWhiteGray,
    borderColor: color.mermaidWhiteGray,
    padding: '0',
    width: '48px',
    height: '48px'
  }
};
