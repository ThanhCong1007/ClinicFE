import { ReactNode } from 'react';

interface ProfileFieldProps {
  label: string;
  value: string;
  icon: ReactNode;
  isEditing: boolean;
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const ProfileField = ({ 
  label, 
  value, 
  icon, 
  isEditing, 
  type = 'text',
  options,
  onChange 
}: ProfileFieldProps) => {
  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          className="form-control"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }
    
    if (type === 'select' && options) {
      return (
        <select
          className="form-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    
    if (type === 'date') {
      return (
        <input
          type="date"
          className="form-control"
          value={value.split('/').reverse().join('-')}
          onChange={(e) => {
            const date = new Date(e.target.value);
            const formatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            onChange(formatted);
          }}
        />
      );
    }
    
    return (
      <input
        type={type}
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      {isEditing ? (
        renderInput()
      ) : (
        <div className="input-group">
          <span className="input-group-text bg-light">
            {icon}
          </span>
          <div className="form-control bg-light">{value}</div>
        </div>
      )}
    </div>
  );
};