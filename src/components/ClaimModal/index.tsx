import React from 'react'

type Props = {
  onClose: Function
}

const Modal: React.FC<Props> = ({ onClose, children }) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-transparent z-[61]">
      <div className="absolute top-0 bottom-0 left-0 right-0 opacity-50 bg-c1E1F1E" onClick={() => onClose()}></div>
      {children}
    </div>
  )
}

export default Modal
