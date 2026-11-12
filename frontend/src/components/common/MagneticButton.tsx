import React, { useRef } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  'data-sound'?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  as?: 'button' | 'div' | 'span';
}

export const MagneticButton: React.FC<MagneticButtonProps> = React.memo(({
  children,
  className = '',
  onClick,
  'data-sound': dataSound,
  type = 'button',
  disabled = false,
  as = 'button',
}) => {
  const elementRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const elem = elementRef.current;
    if (!elem) return;

    const rect = elem.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.22;
    const deltaY = (e.clientY - centerY) * 0.22;

    elem.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0)`;
    elem.style.transition = 'transform 0.08s ease-out';
  };

  const handleMouseLeave = () => {
    const elem = elementRef.current;
    if (!elem) return;

    elem.style.transform = 'translate3d(0px, 0px, 0)';
    elem.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  };

  const sharedStyle: React.CSSProperties = {
    transform: 'translate3d(0px, 0px, 0)',
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const sharedClass = `relative inline-flex items-center justify-center cursor-pointer select-none transition-shadow ${className}`;

  if (as === 'div') {
    return (
      <div
        ref={elementRef as React.RefObject<HTMLDivElement | null>}
        onClick={onClick}
        data-sound={dataSound}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={sharedStyle}
        className={sharedClass}
      >
        {children}
      </div>
    );
  }

  if (as === 'span') {
    return (
      <span
        ref={elementRef as React.RefObject<HTMLSpanElement | null>}
        onClick={onClick}
        data-sound={dataSound}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={sharedStyle}
        className={sharedClass}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      ref={elementRef as React.RefObject<HTMLButtonElement | null>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      data-sound={dataSound}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={sharedStyle}
      className={sharedClass}
    >
      {children}
    </button>
  );
});

MagneticButton.displayName = 'MagneticButton';

