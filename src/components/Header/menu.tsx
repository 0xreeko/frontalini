import React from 'react'
import Image from 'next/image'

// Import data json file
import data from '../data/data.json'
import { BOLDTOKEN_ADDRESS } from '../../constants/'

type props = {
  onClose: Function;
}

const Menu: React.FC<props> = ({ onClose }) => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-40 w-full h-full bg-transparent">
      <div className="absolute top-0 bottom-0 left-0 right-0 opacity-50 bg-c1E1F1E" onClick={() => onClose()}></div>
      <div className="absolute left-0 z-50 min-h-screen w-100 bg-c18222E">
        <div className="flex justify-between p-5 bg-cE3122D">
          <p className="font-sansBold text-cF0EFEE">MENU</p>
          <Image
            src="/images/menu/close.png"
            className="cursor-pointer"
            alt="close"
            width={16}
            height={16}
            onClick={() => onClose()}
            objectFit="contain"
          />
        </div>

        <div className="p-10">
          {
            data.leftMenu.map((navItem) => {
              const target = navItem.external ? "_blank" : "_self";
              const rel = navItem.external ? "noreferrer" : "";
              const href = navItem.name === "buyBold" ? navItem.href + BOLDTOKEN_ADDRESS : navItem.href;

              return (
                <React.Fragment key={navItem.id}>
                  <a href={href} target={target} rel={rel}>
                    <div className="mb-8 duration-300 opacity-70 hover:opacity-100">
                      <p className="font-sansBold text-cF0EFEE text-18px">{navItem.text}</p>
                      <p className="font-sans opacity-50 text-cF0EFEE text-14px">{navItem.description}</p>
                    </div>
                  </a>

                  {navItem.break && <div className="w-full h-px my-10 border opacity-50 border-cF0EFEE"></div>}
                  </React.Fragment>
              )
            })
          }
          {
            data.leftMenuSocials.map((navItemSocial) => {
              const target = navItemSocial.external ? "_blank" : "_self";
              const rel = navItemSocial.external ? "noreferrer" : "";

              return (
                <React.Fragment key={navItemSocial.id}>
                  <a href={navItemSocial.href} target={target} rel={rel}>
                    <div className="flex mb-8 duration-300 opacity-70 hover:opacity-100">
                      <Image src={navItemSocial.img} alt={navItemSocial.name} width={20} height={15} objectFit="contain" />
                      <p className="ml-2 font-sansBold text-cF0EFEE">{navItemSocial.name}</p>
                    </div>
                  </a>
                </React.Fragment>
              )
            }
            )}

        </div>
      </div>
    </div>
  )
}

export default Menu
