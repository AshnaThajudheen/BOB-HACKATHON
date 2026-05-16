import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-white text-black hover:scale-105 disabled:hover:scale-100',
    secondary: 'border border-gray-600 hover:bg-gray-900 disabled:hover:bg-transparent',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'hover:bg-gray-900',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;

// Made with Bob
