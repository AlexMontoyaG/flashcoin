'use client';

import { useState, useEffect } from 'react';

interface PersonalInfoFormProps {
  onBack: () => void;
  onContinue: (data: any) => void;
  selectedBank: string;
}

export default function PersonalInfoForm({ onBack, onContinue, selectedBank }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    document: '',
    accountType: '',
    accountNumber: ''
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { fullName, email, phone, document } = formData;
    const isValid = fullName.trim() !== '' && 
                   email.trim() !== '' && 
                   validateEmail(email) &&
                   validatePhone(phone) &&
                   validateDocument(document) &&
                   (selectedBank === 'NEQUI' || selectedBank === 'DAVIPLATA' || 
                    (formData.accountType !== '' && formData.accountNumber.trim() !== ''));
    setIsFormValid(isValid);
  }, [formData, selectedBank]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    return phone.length === 10 && /^\d+$/.test(phone);
  };

  const validateDocument = (document: string) => {
    return document.length >= 8 && /^\d+$/.test(document);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let newValue = value;
    
    // Validaciones específicas por campo
    if (name === 'phone') {
      // Solo permitir números y máximo 10 dígitos
      newValue = value.replace(/\D/g, '').slice(0, 10);
    }
    else if (name === 'document' || name === 'accountNumber') {
      // Solo permitir números
      newValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const getPhoneLabel = () => {
    if (selectedBank === 'NEQUI') return 'Teléfono Nequi';
    if (selectedBank === 'DAVIPLATA') return 'Teléfono Daviplata';
    return 'Teléfono';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onContinue(formData);
    }
  };

  return (
    <section id="step2" className="step-content active">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="input-group">
          <label htmlFor="fullName">Nombre completo</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Ingresa tu nombre completo"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="phone">{getPhoneLabel()}</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={`Ingresa tu ${getPhoneLabel().toLowerCase()}`}
            minLength={10}
            maxLength={10}
            pattern="\d{10}"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="document">Número de documento</label>
          <input
            type="text"
            id="document"
            name="document"
            value={formData.document}
            onChange={handleChange}
            placeholder="Ingresa tu número de documento"
            minLength={8}
            pattern="\d+"
            required
          />
        </div>

        {selectedBank !== 'NEQUI' && selectedBank !== 'DAVIPLATA' && (
          <>
            <div className="input-group">
              <label htmlFor="accountType">Tipo de cuenta</label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona el tipo de cuenta</option>
                <option value="AHORROS">AHORROS</option>
                <option value="CORRIENTE">CORRIENTE</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="accountNumber">Número de cuenta</label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Ingresa el número de cuenta"
                pattern="\d+"
                required
              />
            </div>
          </>
        )}

        <div className="button-group">
          <button type="button" className="back-btn" onClick={onBack}>
            Atrás
          </button>
          <button 
            type="submit" 
            className={`continue-btn ${!isFormValid ? 'disabled' : ''}`}
            disabled={!isFormValid}
          >
            Finalizar
          </button>
        </div>
      </form>
    </section>
  );
}
