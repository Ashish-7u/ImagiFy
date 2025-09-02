import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="w-full mt-20 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={assets.logo} alt="" width={120} />
          <span className="text-lg font-semibold text-blue-700 hidden sm:inline">ImagiFy</span>
        </div>
        <p className="text-center text-gray-500 text-sm flex-1 sm:pl-4">
          © {new Date().getFullYear()} VssuTaI.dev | All rights reserved
        </p>
        <div className="flex gap-4">
          <a href="#" aria-label="Facebook">
            <img src={assets.facebook_icon} alt="Facebook" width={32} className="hover:scale-110 transition-transform duration-200" />
          </a>
          <a href="#" aria-label="Twitter">
            <img src={assets.twitter_icon} alt="Twitter" width={32} className="hover:scale-110 transition-transform duration-200" />
          </a>
          <a href="#" aria-label="Instagram">
            <img src={assets.instagram_icon} alt="Instagram" width={32} className="hover:scale-110 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
