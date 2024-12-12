import React, { FormEvent, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import client from '../lib/apolloClient';
import styles from '../styles/contactForm.module.css';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface InputProps {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  pattern?: string;
  maxLength?: number;
}

const TextInput: React.FC<InputProps> = ({
  label,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  pattern,
  maxLength,
}) => (
  <div className={styles['fieldWithSpace']}>
    <label htmlFor={id} className={styles['input-label']}>
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      className={styles['input-field']}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      pattern={pattern}
      maxLength={maxLength}
    />
  </div>
);

interface SelectProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: { value: string; label: string }[];
}

const SelectInput: React.FC<SelectProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  required = false,
  options,
}) => (
  <div className={styles['fieldWithSpace']}>
    <label htmlFor={id} className={styles['input-label']}>
      {label}
    </label>
    <select
      id={id}
      name={name}
      className={styles['select-field']}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const SupportForm: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    typeOfIssue: '',
    walletServiceProvider: '',
    transactionHash: '',
    integrationDetails: '',
    walletAddress: '',
    tokenInvolved: '',
    marketInvolved: '',
    functionInvolved: '',
    errorCode: '',
    otherDetails: '',
    mobileOrDesktop: '',
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<FileList | null>(null); // State for file attachments

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    // Validate email on change
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError('Invalid email address.');
      } else {
        setEmailError(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Final email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Logging Attachments
    if (attachments && attachments.length > 0) {
      console.log('Files selected:', attachments);
      // Implement upload logic here
    }

    // Log the form state
    console.log('Form submitted with state:', formState);

    // Show success message
    setSuccessMessage('Your support request has been submitted successfully! We will email you via wecare@aave.com.');
    setEmailError(null);

    // Reset the form
    setFormState({
      name: '',
      email: '',
      typeOfIssue: '',
      walletServiceProvider: '',
      transactionHash: '',
      integrationDetails: '',
      walletAddress: '',
      tokenInvolved: '',
      marketInvolved: '',
      functionInvolved: '',
      errorCode: '',
      otherDetails: '',
      mobileOrDesktop: '',
    });
    setAttachments(null);
  };

  return (
    <form className={styles['form-container']} onSubmit={handleSubmit}>
      <TextInput
        label="Name"
        id="name"
        name="name"
        type="text"
        placeholder="Enter your name"
        value={formState.name}
        onChange={handleChange}
        required
      />

      <TextInput
        label="Email"
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formState.email}
        onChange={handleChange}
        required
      />
      {emailError && <p className={styles['error-message']}>{emailError}</p>}

      <SelectInput
        label="What Type of Issue Are You Experiencing?"
        id="typeOfIssue"
        name="typeOfIssue"
        value={formState.typeOfIssue}
        onChange={handleChange}
        required
        options={[
          { value: 'wallet-issues', label: 'Wallet and Connection Issues' },
          { value: 'transaction-problems', label: 'Transaction Problems' },
          { value: 'developer-support', label: 'Developer or Integration Support' },
          { value: 'other', label: 'Other' },
        ]}
      />

      {formState.typeOfIssue === 'wallet-issues' && (
        <>
          <TextInput
            label="Wallet Service Provider"
            id="walletServiceProvider"
            name="walletServiceProvider"
            type="text"
            placeholder="e.g., MetaMask, Ledger, etc."
            value={formState.walletServiceProvider}
            onChange={handleChange}
            required
          />

          <SelectInput
            label="Are you using Mobile or Desktop?"
            id="mobileOrDesktop"
            name="mobileOrDesktop"
            value={formState.mobileOrDesktop}
            onChange={handleChange}
            required
            options={[
              { value: 'mobile', label: 'Mobile' },
              { value: 'desktop', label: 'Desktop' },
            ]}
          />

            {/* File attachments field */}
      <div className={styles['fieldWithSpace']}>
        <label htmlFor="attachments" className={styles['input-label']}>
          Attach Files (Screenshots, Videos)
        </label>
        <input
          id="attachments"
          name="attachments"
          type="file"
          multiple
          onChange={handleFileChange}
          className={styles['input-field']}
        />
      </div>
        </>
      )}

      {formState.typeOfIssue === 'transaction-problems' && (
        <>
          <TextInput
            label="Wallet Address"
            id="walletAddress"
            name="walletAddress"
            type="text"
            placeholder="e.g., 0x123...abc"
            value={formState.walletAddress}
            onChange={handleChange}
            required
          />

          <TextInput
            label="Token Involved"
            id="tokenInvolved"
            name="tokenInvolved"
            type="text"
            placeholder="e.g., USDC, ETH, etc."
            value={formState.tokenInvolved}
            onChange={handleChange}
            required
          />

          <TextInput
            label="Market Involved"
            id="marketInvolved"
            name="marketInvolved"
            type="text"
            placeholder="e.g., Ethereum v3, Ethereum v2, etc."
            value={formState.marketInvolved}
            onChange={handleChange}
            required
          />

          <TextInput
            label="Function Involved"
            id="functionInvolved"
            name="functionInvolved"
            type="text"
            placeholder="e.g., Supply, Borrow, etc."
            value={formState.functionInvolved}
            onChange={handleChange}
            required
          />

          <TextInput
            label="Error Code"
            id="errorCode"
            name="errorCode"
            type="text"
            placeholder="Paste the error code if available"
            value={formState.errorCode}
            onChange={handleChange}
            required
          />

            {/* File attachments field */}
      <div className={styles['fieldWithSpace']}>
        <label htmlFor="attachments" className={styles['input-label']}>
          Attach Files (Screenshots, Videos)
        </label>
        <input
          id="attachments"
          name="attachments"
          type="file"
          multiple
          onChange={handleFileChange}
          className={styles['input-field']}
        />
      </div>
        </>
      )}

      {formState.typeOfIssue === 'developer-support' && (
        <>
          <TextInput
            label="Details"
            id="integrationDetails"
            name="integrationDetails"
            type="text"
            placeholder="Please describe your inquiry"
            value={formState.integrationDetails}
            onChange={handleChange}
            required
          />

            {/* File attachments field */}
      <div className={styles['fieldWithSpace']}>
        <label htmlFor="attachments" className={styles['input-label']}>
          Attach Files (Screenshots, Videos)
        </label>
        <input
          id="attachments"
          name="attachments"
          type="file"
          multiple
          onChange={handleFileChange}
          className={styles['input-field']}
        />
      </div>
        </>
      )}

      {formState.typeOfIssue === 'other' && (
        <>
          <TextInput
            label="Please Describe Your Issue"
            id="otherDetails"
            name="otherDetails"
            type="text"
            placeholder="Describe your issue in detail"
            value={formState.otherDetails}
            onChange={handleChange}
            required
          />

          <TextInput
            label="Error Code"
            id="errorCode"
            name="errorCode"
            type="text"
            placeholder="Paste the error code if available"
            value={formState.errorCode}
            onChange={handleChange}
            required
          />

          {/* File attachments field */}
      <div className={styles['fieldWithSpace']}>
        <label htmlFor="attachments" className={styles['input-label']}>
          Attach Files (Screenshots, Videos)
        </label>
        <input
          id="attachments"
          name="attachments"
          type="file"
          multiple
          onChange={handleFileChange}
          className={styles['input-field']}
        />
      </div>
        </>
      )}


      <button type="submit" className={styles['submit-button']}>
        Submit
      </button>

      {successMessage && (
        <p className={styles['success-message']}>{successMessage}</p>
      )}
    </form>
  );
};

export default SupportForm;
