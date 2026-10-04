import React from 'react';
import logoSrc from '../../assets/logo.png';

export const BrandLogo = ({
  size = 'md',
  className = '',
  alt = 'The Lens Hut Logo',
  ...props
}) => {
  const sizeClasses = {
    xs: 'h-5 w-auto',
    sm: 'h-7 w-auto',
    md: 'h-9 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto',
  };

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`object-contain inline-block shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    />
  );
};

export default BrandLogo;
