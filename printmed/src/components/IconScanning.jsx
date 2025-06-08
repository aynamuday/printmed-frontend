import '../assets/styles/QrScanAnimation.css'

function IconScanning({src}) {
  return (
    <div className="relative w-28 h-28 mx-auto">
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          className="w-full h-full object-contain"
          src={src}/>
      </div>
      <div className="scan-line"></div>
    </div>
  )
}

export default IconScanning