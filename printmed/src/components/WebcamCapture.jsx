import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam';

const WebcamCapture = ({setImage, setShow}) => {
  const webcamRef = useRef(null)

  const [capturedImage, setCapturedImage] = useState(null)

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setCapturedImage(imageSrc)
  }

  const handleApprove = () => {
    setImage(capturedImage)
    setShow(false)
  }

  return (
    <div className='flex justify-center items-center h-svh'>
        <div className=' relative'>
          <button onClick={() => setShow(false)} className="absolute top-0 right-0 mt-6 mr-6 w-fit z-40"><i className="bi bi-x-lg text-3xl text-white "></i></button>
          { !capturedImage ? (
            <>
              <Webcam 
                ref={webcamRef}
                audio={false}
                className='w-[650px] h-[650px] object-cover rounded-2xl bg-black'
                screenshotFormat='image/png'
                videoConstraints={{
                  facingMode: "user",
              }}/>

              <div className='flex justify-center -mt-[100px]'>
                <button onClick={() => capture()} className='bg-white p-2 rounded-full w-fit z-50'>
                  <div className='bg-red-500 w-[50px] h-[50px] rounded-full hover:bg-red-700'></div>
                </button>
              </div>
            </>
          ) : (
            <>
              <img src={capturedImage} className='w-[500px] h-[500px] object-cover rounded-2xl shadow-sm shadow-gray-500' />

              <div className='grid grid-cols-2 items-center justify-center mt-4'>
                <div onClick={() => setCapturedImage(null)} className=' cursor-pointer flex justify-center items-center bg-white border border-[#B43C3A]'>
                  <i className='bi bi-arrow-clockwise text-[#B43C3A] text-[40px] font-extrabold p-0 m-0'></i>
                </div>
                <div onClick={() => handleApprove()} className='cursor-pointer flex justify-center items-center bg-white border border-green-500 '>
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