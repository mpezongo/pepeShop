import React from 'react'

export default function Loader() {
  return (
    <div class="flex flex-row gap-2 bg-black w-full h-10 rounded-lg justify-center items-center mt-6">
        <div class="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.7s]"></div>
        <div class="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.3s]"></div>
        <div class="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:.7s]"></div>
    </div>
  )
}
