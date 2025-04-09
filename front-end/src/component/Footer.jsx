import React from 'react'
import icons from '../constant/icons'
import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <div className='w-full bg-white shadow-sm shadow-black-20 flex justify-center items-center border-t h-16 text-xl font-Montserrat fixed max-w-[600px] bottom-0'>
      <NavLink to="/" className='w-1/4 flex justify-center items-center flex-col'>
        <icons.MdOutlineDashboard className='text-2xl mr-2' />
        <span className='text-sm'>Accueil</span>
      </NavLink>
      <NavLink to="/inventory" className='w-1/4 flex justify-center items-center flex-col'>
        <icons.PiCubeDuotone className='text-2xl mr-2' />
        <span className='text-sm'>Stock</span>
      </NavLink>
      <NavLink to="/order" className='w-1/4 flex justify-center items-center flex-col'>
        <icons.BsCart3 className='text-2xl mr-2' />
        <span className='text-sm'>Commandes</span>
      </NavLink>
      <NavLink to="/depenses" className='w-1/4 flex justify-center items-center flex-col'>
        <icons.LuCreditCard className='text-2xl mr-2' />
        <span className='text-sm'>Depenses</span>
      </NavLink>
    </div>
  )
}
