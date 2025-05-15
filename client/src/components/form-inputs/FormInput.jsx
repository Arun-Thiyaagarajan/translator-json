
const FormInput = ({ label, name, type, defaultValue, size, inputRef, required, placeholder }) => {
  return (
    <label className="form-control h-20 w-full">
      <div className="label">
        <span className="label-text font-semibold capitalize">{label}</span>
      </div>
      <input
        ref={inputRef}
        type={type}
        name={name}
        placeholder={placeholder || ''}
        defaultValue={defaultValue}
        className={`input input-bordered border-slate-300 ${size} focus-within:ring-1 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-white transition-shadow`}
        required={required}
      />
    </label>
  );
}
export default FormInput;