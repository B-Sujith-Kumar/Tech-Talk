import React from 'react'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='min-h-screen flex min-w-full justify-center items-center bg-background'>
      {children}
    </div>
  )
}

export default Layout
