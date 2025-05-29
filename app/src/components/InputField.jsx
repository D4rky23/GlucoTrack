export default function InputField({ 
  label, 
  register, 
  name, 
  type = 'number', 
  step = 'any',
  error,
  options,
  placeholder,
  className = '',
  ...props 
}) {
  const inputClasses = `input-field ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`

  if (type === 'select') {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <select 
          {...register(name, { required: true })} 
          className={inputClasses}
          {...props}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-red-500 text-xs mt-1">{error.message}</span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input 
        {...register(name, { required: true })} 
        type={type} 
        step={step}
        placeholder={placeholder}
        className={inputClasses}
        {...props}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1">{error.message}</span>
      )}
    </div>
  )
}
