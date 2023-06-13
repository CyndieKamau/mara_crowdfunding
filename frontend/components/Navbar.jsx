import React, {useState, useContext} from 'react';

//internal imports
import { CrowdFundingContext } from '@/context/CrowdFunding';
import { Menu, CustomButton } from './';


const Navbar = () => {
  //import data from context
  const {currentAccount, connectWallet} = useContext(CrowdFundingContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const menuList = ["Intro", "Build on Mara", "Block Explorer", "Get Faucets"];

  return (
    <div className='backgroundMain'>
      <div className='px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8'>
        <div className='relative flex items-center justify-between'>
          <div className='flex items-center'>
            <a 
              href='/'
              aria-label='mara Company'
              title='mara'
              className='inline-flex mr-8 items-center'
            >
              <span className='ml-2 text-xl font-bold text-gray-100 tracking-wide lowercase'>
                mara
              </span>
            </a>
            
            //render the menu
            <ul className='flex items-center hidden space-x-8 lg:flex '>
              {menuList.map((el, i) => (
                <li key={i + 1} className='inline-flex items-center space-x-2'>
                  <a 
                    href='/'
                    aria-label='Building on mara'
                    title='mara blockchain'
                    onClick={() => setMenuOpen(false)}
                    className='text-gray-100 hover:text-teal-accent-400 font-medium tracking-wide transition-colors duration-200'
                  >
                    {el}
                  </a>
                </li>
              ))};
            
            </ul>

          </div>

          {!currentAccount && (
            <div className='flex items-center sm:flex flex-row justify-end gap-4'>
              <CustomButton
                onClick={() => connectWallet()}
                text='Connect Wallet'
                styles='bg-[#8c6dfd]'
              />
            </div>
          )};

          {currentAccount && (
            <div className='flex items-center sm:flex flex-row justify-end gap-4'>
            <CustomButton
            onClick={() => connectWallet()}
            text='Connected'
            styles='bg-[#1dc071]'
            />
            </div>

          )};


        </div>
      </div>

    </div>
  )


}

export default Navbar
