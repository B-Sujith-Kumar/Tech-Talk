import React from 'react'

const RenderPost = ({content}: {content: string}) => {
  return (
    <div dangerouslySetInnerHTML={{__html: content}} className=''>
    </div>
  )
}

export default RenderPost
