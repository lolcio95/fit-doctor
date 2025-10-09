import wealthArtLogo from '../../static/page-builder-thumbnails/wealthArcLogo.png'

export const LogoComponent = () => {
  return (
    <img
      src={typeof wealthArtLogo === 'string' ? wealthArtLogo : wealthArtLogo.src}
      alt="Sanity logo"
    />
  )
}
