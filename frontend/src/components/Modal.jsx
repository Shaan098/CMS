import React from 'react';

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h3>{title}</h3>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
