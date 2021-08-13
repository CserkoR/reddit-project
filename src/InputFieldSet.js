export default function InputFieldSet(
    {
      errors, fieldValues, handleInputChange, handleInputBlur, type, name, labelText, required, reference
    }) {
    return (
      <div className={`mb-3 ${errors[name] !== '' ? "was-validated" : ""}`}>
        <label htmlFor={name} className="form-label">{labelText}</label>
        <input
          type={type}
          className="form-control"
          id={name}
          name={name}
          value={fieldValues[name]}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required={required}
          ref={reference}
        />
        <div className="invalid-feedback">
          {errors[name]}
        </div>
      </div>
    );
  }