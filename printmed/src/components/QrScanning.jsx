import React from 'react'

import '../assets/styles/QrScanAnimation.css'
import qr from '../assets/images/qr.png'

const QrScanning = () => {
  return (
    <div className="relative w-28 h-28 mx-auto">
        <div className="absolute inset-0 flex justify-center items-center">
            <img 
                className="w-full h-full object-contain" 
                src={qr} 
                alt="QR Code" 
            />
        </div>
        <div className="scan-line"></div>
    </div>
  )
}

export default QrScanning