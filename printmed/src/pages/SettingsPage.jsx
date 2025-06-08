import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../context/AppContext';
import Settings from '../components/Settings';
import {globalSwalNoIcon, globalSwalWithIcon} from '../utils/globalSwal';
import { capitalizedWords } from '../utils/wordUtils';
import { showError } from '../utils/fetch/showError';
import { BounceLoader } from 'react-spinners';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const SettingsPage = () => {
  const { user, setUser, token, setToken } = useContext(AppContext);
  const navigate = useNavigate()
  const [signature, setSignature] = useState(null)
  const [signatureUrl, setSignatureUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSignature(file);
      
      // const signatureUrl = URL.createObjectURL(file);
      // setSignature(signatureUrl);
    }
  };

  const uploadSignature = async (e) => {
    e.preventDefault()
    if (signature == null) return

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('signature', signature)

      const res = await fetch("http://127.0.0.1:8000/api/upload-signature", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        },
        body: formData
      })

      if (!res.ok) {
        throw new Error('Something went wrong. Please try again later.')
      }

      const data = await res.json()
      console.log(data)

      setUser({...user, signature: data.signature })
      setSignature(null)
    } catch (err) {
      showError(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteSignature = async (e) => {
    e.preventDefault()

    globalSwalNoIcon.fire({
      title: "Are you sure you want to delete your signature?",
      showCancelButton: true,
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true)
    
          const res = await fetch('api/delete-signature', {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
      
          if (!res.ok) {
            throw new Error('Something went wrong. Please try again later.')
          }
      
          setUser({...user, signature: null})
          globalSwalWithIcon.fire({
            icon: 'success',
            title: 'Signature deleted successfully!',
            showConfirmButton: false,
            showCloseButton: true
          })
        } catch (error) {
          showError(error)
        } finally {
          setLoading(false)
        }
      }
    })
  }

  // const handleLogout = async () => {
  //   const result = await globalSwalNoIcon.fire({
  //     title: 'Are you sure you want to log out?',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'Cancel'
  //   });
  
  //   if (result.isConfirmed) {
  //     try {
  //       const res = await fetch("api/logout", {
  //         method: 'POST',
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         }
  //       });
  
  //       if (!res.ok) {
  //         throw new Error('There was an issue logging out. Please try again.')
  //       }
  
  //       await res.json();
  
  //       localStorage.removeItem('token');
  //       setToken(null);
  //       setUser(null);
  //       navigate('/login');
  //     } catch (err) {
  //       showError(err)
  //     }
  //   }
  // };

  return (
    <>
      <Sidebar />
      { loading && (
        <div className='z-50 flex items-center justify-center fixed top-0 start-0 end-0 bottom-0 scroll-m-0 bg-white bg-opacity-30'>
          <BounceLoader className='' loading={loading} size={60} color='#6CB6AD' />
        </div>
      )}
      <div className="lg:pl-[250px] min-h-screen bg-white">
        <Header />
        <Settings>
        <h2 className="text-2xl font-bold text-center sm:text-left">{user.full_name.toUpperCase()}</h2>
        <p className="text-black-500 text-center sm:text-left">{capitalizedWords(user.role)}</p>
        <p className="text-black-500 text-center sm:text-left">{user.personnel_number}</p>
        <p className="text-black-500 text-center sm:text-left">{user.email}</p>

        <div className='min-h-8'></div>

        <div className='grid grid-cols-3 gap-x-4 gap-y-0 ml-10 max-w-[400px]'>
          {(user.role == "physician" || user.role == "secretary") && (
            <>
              <p>Department:</p>
              <p className='col-span-2'><strong>{user.department_name}</strong></p>
            </>
          )}
          <p>Sex:</p>
          <p className='col-span-2'><strong>{user.sex}</strong></p>
          <p>Birthdate:</p>
          <p className='col-span-2'><strong>{user.birthdate}</strong></p>
        </div>

        <div className="mt-6 space-y-4 w-full flex flex-col items-center">
          {user.role == "physician" && 
            <div className={`relative`}>
              <input 
                id='upload-signature'
                type="file" 
                accept='image/*'
                onChange={handleSignatureChange}
                className='hidden'
              />

              {user.signature || signature ? (
                <div className='flex gap-4 mb-4 justify-center items-center'>
                  <div className='relative'>
                    <img 
                      src={ signature ? URL.createObjectURL(signature) : (user.signature || '') }
                      className={`max-w-full h-20 object-cover rounded-md ${signature && "border border-gray-400 p-2" }`}
                    />
                    { signature && 
                      <i onClick={() => {setSignature(null)}} className='bi bi-x px-1 rounded-full focus:outline-none text-center bg-gray-50 text-[#248176] cursor-pointer absolute -top-3 -right-3'></i>
                    }
                  </div>

                  {signature ? (
                    <div>
                      <button
                        className="px-8 py-2 bg-[#248176] rounded-md focus:outline-none text-center hover:bg-blue-600 text-white cursor-pointer"
                        onClick={(e) => uploadSignature(e)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor='upload-signature'
                        className="px-2 py-2 rounded-full focus:outline-none text-center hover:bg-[#f4f4f4] text-[#248176] cursor-pointer"
                      >
                        <i className='bi bi-pencil-fill'></i>
                      </label>
                      <button
                        className="px-2 py-1 rounded-full focus:outline-none text-center hover:bg-[#f4f4f4] text-[#248176] cursor-pointer"
                        onClick={(e) => deleteSignature(e)}
                      >
                        <i className='bi bi-trash'></i>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className='min-h-10'></div>
        
                  <label
                    htmlFor='upload-signature'
                    className="w-48 px-4 py-2 bg-[#248176] inline-block rounded-md hover:bg-[#359c90] focus:outline-none text-center text-white cursor-pointer"
                  >
                    Upload Signature
                  </label>
                </>
              )}
            </div>
          }

          {user.role === 'super admin' && (
            <Link
              to="/settings/edit-profile"
              className="w-48 sm:w-48 px-4 py-2 bg-[#248176] rounded-md hover:bg-[#359c90] focus:outline-none text-center text-white"
            >
              Edit
            </Link>
          )}
          <Link
            to="/settings/update-email"
            className="w-48 sm:w-48 px-4 py-2 bg-[#248176] rounded-md hover:bg-[#359c90] focus:outline-none text-center text-white"
          >
            Update Email
          </Link>
          <Link
            to="/settings/change-password"
            className="w-48 sm:w-48 px-4 py-2 bg-[#248176] rounded-md hover:bg-[#359c90] focus:outline-none text-center text-white"
          >
            Change Password
          </Link>
        </div>

        {/* <div className='min-h-10'></div>
        <button
          onClick={handleLogout}
          className="w-48 sm:w-48 px-4 py-2 bg-[#b43c39] text-white rounded-md hover:bg-[#a43331] focus:outline-none"
        >
          Logout
        </button> */}
      </Settings>
      </div>
      
    </>
  );
};

export default SettingsPage;
