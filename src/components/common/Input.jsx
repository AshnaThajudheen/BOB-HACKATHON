const Input = ({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`
          bg-gray-900 border border-gray-800 rounded-xl px-4 py-3
          text-white placeholder-gray-500
          focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-400">{error}</span>
      )}
    </div>
  );
};

export default Input;

// Made with Bob
