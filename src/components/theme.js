const color = {
  mermaidDark: '#2C3742',
  mermaidWhite: 'white',
  mermaidBlue: '#468DAE',
  mermaidBlack: 'black',
  mermaidNotAllowed: '#9C9C9C',
  mermaidQuiteGray: '#BCCAD2',
  mermaidGray: '#585858'
};

export const theme = {
  backButton: {
    color: color.mermaidDark,
    bgColor: color.mermaidWhite,
    position: 'fixed',
    width: '70px',
    padding: '5px',
    initialTranslate: 'translate(0%)',
    hoverTranslate: 'translate(-5%, 0%)'
  },
  cardButton: {
    color: color.mermaidWhite,
    bgColor: color.mermaidBlue,
    notAllowedBgColor: color.mermaidNotAllowed,
    width: '150px',
    padding: '1px'
  },
  fullZoom: {
    color: color.mermaidGray,
    bgColor: color.mermaidWhite,
    borderColor: color.mermaidQuiteGray,
    position: 'fixed',
    width: '32px',
    height: '30px',
    padding: '6px'
  }
};
