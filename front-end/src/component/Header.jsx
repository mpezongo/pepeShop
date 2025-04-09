import React from 'react'
import icons from '../constant/icons'

export default function Header({ icon, title }) {
  const IconComponent = icons[icon]; // Récupère l'icône dynamiquement

  return (
    <div className='w-full bg-white shadow-sm shadow-black-20 flex justify-center items-center border-b h-16 text-xl font-Montserrat fixed max-w-[600px] top-0'>
      {IconComponent && <IconComponent className='text-2xl mr-2' />}
      {title}
    </div>
  );
}
