import React, { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const SecretaryContext = createContext();

export const SecretaryProvider = () => {
  const [loadingDuplicate, setLoading] = useState(false);

  const checkForDuplicatePatient = async (formData) => {
    setLoading(true);

    try {
      const response = await fetch('/api/duplicate-patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          birthdate: formData.birthdate,
          sex: formData.sex,
        }),
      });

      const result = await response.json();
      setLoading(false);
      
      if (response.ok) {
        if (result.length > 0) {
          return { isDuplicate: true, message: 'Patient already exists.' };
        } else {
          return { isDuplicate: false };
        }
      } else {
        throw new Error('Failed to check for duplicates');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error checking for duplicates:', error);
      return { isDuplicate: false, message: 'Error checking for duplicates.' };
    }
  };

  return (
    <SecretaryContext.Provider value={{ 
      checkForDuplicatePatient, loadingDuplicate
    }}>
      <Outlet />
    </SecretaryContext.Provider>
  );
};

export default SecretaryContext;
