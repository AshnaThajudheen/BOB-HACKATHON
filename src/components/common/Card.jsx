import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'bg-gray-950 border border-gray-800 rounded-3xl p-6';
  const hoverStyles = hover ? 'hover:border-white transition-all duration-300 cursor-pointer' : '';
  
  const Component = onClick || hover ? motion.div : 'div';
  const motionProps = onClick || hover ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  } : {};
  
  return (
    <Component
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;

// Made with Bob
