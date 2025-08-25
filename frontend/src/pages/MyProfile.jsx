import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [isImageHovered, setIsImageHovered] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    // Function to update user profile data using API
    const updateUserProfileData = async () => {

        try {

            const formData = new FormData();

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Function to handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setImage(file);
            // If not in edit mode, automatically save the image
            if (!isEdit) {
                const tempUserData = { ...userData };
                const formData = new FormData();
                formData.append('name', tempUserData.name)
                formData.append('phone', tempUserData.phone)
                formData.append('address', JSON.stringify(tempUserData.address))
                formData.append('gender', tempUserData.gender)
                formData.append('dob', tempUserData.dob)
                formData.append('image', file)

                axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })
                    .then(({ data }) => {
                        if (data.success) {
                            toast.success('Profile image updated successfully!')
                            loadUserProfileData()
                            setImage(false)
                        } else {
                            toast.error(data.message)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        toast.error('Failed to update image')
                    })
            }
        }
    }

    return userData ? (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

            {/* Profile Image Section */}
            <div className='relative'>
                <label htmlFor='image' className='cursor-pointer'>
                    <div 
                        className='inline-block relative group'
                        onMouseEnter={() => setIsImageHovered(true)}
                        onMouseLeave={() => setIsImageHovered(false)}
                    >
                        <img 
                            className={`w-36 rounded transition-all duration-300 ${isImageHovered ? 'opacity-75 scale-105' : ''}`} 
                            src={image ? URL.createObjectURL(image) : userData.image} 
                            alt="Profile" 
                        />
                        
                        {/* Overlay with upload icon */}
                        <div className={`absolute inset-0 bg-black bg-opacity-30 rounded flex items-center justify-center transition-opacity duration-300 ${isImageHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <img className='w-8 h-8' src={assets.upload_icon} alt="Upload" />
                        </div>
                        
                        {/* Upload icon for edit mode */}
                        {isEdit && (
                            <img className='w-10 absolute bottom-12 right-12' src={assets.upload_icon} alt="Upload" />
                        )}
                    </div>
                </label>
                <input 
                    onChange={handleImageUpload} 
                    type="file" 
                    id="image" 
                    accept="image/*"
                    hidden 
                />
            </div>

            {isEdit
                ? <input className='bg-gray-50 text-3xl font-medium max-w-60' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                : <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
            }

            <hr className='bg-[#ADADAD] h-[1px] border-none' />

            <div>
                <p className='text-gray-600 underline mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
                    <p className='font-medium'>Email id:</p>
                    <p className='text-green-500'>{userData.email}</p>
                    <p className='font-medium'>Phone:</p>

                    {isEdit
                        ? <input className='bg-gray-50 max-w-52' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                        : <p className='text-green-500'>{userData.phone}</p>
                    }

                    <p className='font-medium'>Address:</p>

                    {isEdit
                        ? <p>
                            <input className='bg-gray-50' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />
                            <br />
                            <input className='bg-gray-50' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} /></p>
                        : <p className='text-gray-500'>{userData.address.line1} <br /> {userData.address.line2}</p>
                    }

                </div>
            </div>
            <div>
                <p className='text-[#797979] underline mt-3'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
                    <p className='font-medium'>Gender:</p>

                    {isEdit
                        ? <select className='max-w-20 bg-gray-50' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} >
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        : <p className='text-gray-500'>{userData.gender}</p>
                    }

                    <p className='font-medium'>Birthday:</p>

                    {isEdit
                        ? <input className='max-w-28 bg-gray-50' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
                        : <p className='text-gray-500'>{userData.dob}</p>
                    }

                </div>
            </div>
            <div className='mt-10'>

                {isEdit
                    ? <button onClick={updateUserProfileData} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Save information</button>
                    : <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Edit</button>
                }

            </div>
        </div>
    ) : null
}

export default MyProfile