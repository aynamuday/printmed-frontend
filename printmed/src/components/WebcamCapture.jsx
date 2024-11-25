import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam';

const WebcamCapture = ({image, setImage, setShow}) => {
  const webcamRef = useRef(null)

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImage(imageSrc)
  }

  return (
    <div className='flex justify-center items-center h-svh'>
        <div className=' relative'>
          { !image ? (
            <>
              <Webcam 
                ref={webcamRef}
                audio={false}
                className='w-[600px] h-[600px] object-cover rounded-2xl'
                screenshotFormat='image/png'
                videoConstraints={{
                  facingMode: "user",
              }}/>

              <div className='flex justify-center -mt-[100px]'>
                <button onClick={() => capture()} className='bg-white p-3 rounded-full w-fit'>
                  <div className='bg-red-500 w-[65px] h-[65px] rounded-full hover:bg-red-700'></div>
                </button>
              </div>
            </>
          ) : (
            <>
              <img src={image} className='w-[500px] h-[500px] object-cover rounded-2xl shadow-sm shadow-gray-500' />

              <div className='grid grid-cols-2 items-center justify-center mt-4'>
                <div onClick={() => setImage(null)} className=' cursor-pointer flex justify-center items-center bg-white border border-[#B43C3A]'>
                  <i className='bi bi-arrow-clockwise text-[#B43C3A] text-[40px] font-extrabold p-0 m-0'></i>
                </div>
                <div onClick={() => setShow(false)} className='cursor-pointer flex justify-center items-center bg-white border border-green-500 '>
                  <i className='bi bi-check2 text-green-500 text-[40px] font-extrabold p-0 m-0'></i>
                </div>
              </div>
            </>
          )}
        </div>
    </div>
  )
}

export default WebcamCapture