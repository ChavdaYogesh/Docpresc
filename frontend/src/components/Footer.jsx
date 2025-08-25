// import React from 'react'
// import { assets } from '../assets/assets'

// const Footer = () => {
//   return (
//     <div className='md:mx-10'>
//       <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

//         <div>
//           <img className='mb-5 w-40' src={assets.logo} alt="" />
//           <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
//         </div>

//         <div>
//           <p className='text-xl font-medium mb-5'>COMPANY</p>
//           <ul className='flex flex-col gap-2 text-gray-600'>
//             <li>Home</li>
//             <li>About us</li>
//             <li>Delivery</li>
//             <li>Privacy policy</li>
//           </ul>
//         </div>

//         <div>
//           <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
//           <ul className='flex flex-col gap-2 text-gray-600'>
//             <li>+1-212-456-7890</li>
//             <li>greatstackdev@gmail.com</li>
//           </ul>
//         </div>

//       </div>

//       <div>
//         <hr />
//         <p className='py-5 text-sm text-center'>Copyright 2024 @ Prescripto.com - All Right Reserved.</p>
//       </div>

//     </div>
//   )
// }

// export default Footer
import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10 '>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* Left */}
            <div>
                <img src={assets.logo} className='w-40 mb-3'></img>
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Your trusted partner for online doctor appointments and prescriptions.Built with using Python & MERN Stack.<br/>📍 India | 🌐 www.docpresc.com <br/> 📧 support@docpresc.com</p>
            </div>

            {/* Center */}
            <div>
                <p className='text-xl font-medium mb-5 mt-2'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>

            {/* Right */}
            <div>
                <p className='text-xl font-medium mb-5 mt-2'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91-997-995-8759</li>
                    <li>docpresc@gmail.com</li>
                </ul>
            </div>
        </div>
        <div>
            {/* Copyright */}
            <hr></hr>
            <p className='py-5 text-sm text-center'>Copyright © 2025 Docpresc - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer