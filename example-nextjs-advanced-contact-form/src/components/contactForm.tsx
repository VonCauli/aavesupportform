// src/contactForm.tsx

import React, { FormEvent, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import client from '../lib/apolloClient';
import styles from '../styles/contactForm.module.css';
import Image from 'next/image';
import { motion } from 'framer-motion';

// GraphQL Mutation Definition
const CREATE_SUPPORT_REQUEST = gql`
  mutation CreateSupportRequest(
    $name: String!
    $email: String!
    $walletAddress: String
    $token: String
    $tokenAmount: String
    $chain: String
    $helpOption: String
    $issueDescription: String
    $errorCode: String
    $browser: String
    $walletProvider: String
    $walletApp: String
    $multipleExtensions: Boolean
    $clearedCache: Boolean
    $proposalFile: String
    $tokenIssueFile: String
    $uiIssueFile: String
    $tokenSwapFile: String
    $clearedCacheFile: String
    $walletConnectionFile: String
  ) {
    createSupportRequest(
      name: $name
      email: $email
      walletAddress: $walletAddress
      token: $token
      tokenAmount: $tokenAmount
      chain: $chain
      helpOption: $helpOption
      issueDescription: $issueDescription
      errorCode: $errorCode
      browser: $browser
      walletProvider: $walletProvider
      walletApp: $walletApp
      multipleExtensions: $multipleExtensions
      clearedCache: $clearedCache
      proposalFile: $proposalFile
      tokenIssueFile: $tokenIssueFile
      uiIssueFile: $uiIssueFile
      tokenSwapFile: $tokenSwapFile
      clearedCacheFile: $clearedCacheFile
      walletConnectionFile: $walletConnectionFile
    ) {
      id
      status
    }
  }
`;

// Reusable Input Components

// TextInput Component
interface InputProps {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  <>
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
      aria-required={required}
    />
  </>
);

// SelectInput Component
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
  <>
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
      aria-required={required}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </>
);

// TextAreaInput Component
interface TextareaProps {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  maxLength?: number;
}

const TextAreaInput: React.FC<TextareaProps> = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  maxLength,
}) => (
  <>
    <label htmlFor={id} className={styles['input-label']}>
      {label}
    </label>
    <textarea
      id={id}
      name={name}
      className={styles['textarea-field']}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      maxLength={maxLength}
      aria-required={required}
    />
  </>
);

// FileInput Component
interface FileInputProps {
  label: string;
  id: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  id,
  name,
  onChange,
  accept = '.jpg,.jpeg,.png,.gif',
}) => (
  <>
    <label htmlFor={id} className={styles['input-label']}>
      {label}
    </label>
    <input
      id={id}
      name={name}
      type="file"
      className={styles['input-field']}
      accept={accept}
      onChange={onChange}
      aria-describedby={`${id}Help`}
    />
    <small id={`${id}Help`} className={styles['input-help']}>
      Allowed formats: JPG, JPEG, PNG, GIF. Max size: 8MB.
    </small>
  </>
);

// Form State Interface
interface FormState {
  initialQuestion: string;
  tokenIssue: string;
  helpOption: string;
  mobileOrDesktop: string;
  issueType: string;
  name: string;
  email: string;
  walletAddress: string;
  company: string;
  uiIssueName: string;
  uiIssueEmail: string;
  uiIssueBrowser: string;
  uiIssueDescription: string;
  tokenSwapName: string;
  tokenSwapEmail: string;
  tokenSwapWalletAddress: string;
  tokenSwapToken: string;
  tokenSwapChain: string;
  tokenSwapIssueDescription: string;
  tokenSwapErrorCode: string;
  mobileWalletApp: string;
  mobileIssueDescription: string;
  desktopWalletProvider: string;
  desktopBrowser: string;
  multipleExtensions: string;
  clearedCache: string;
  clearedCacheIssueDescription: string;
  proposalFile: File | null;
  tokenIssueFile: File | null;
  uiIssueFile: File | null;
  tokenSwapFile: File | null;
  clearedCacheFile: File | null;
  walletConnectionFile: File | null;
}

const SupportForm: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    initialQuestion: '',
    tokenIssue: '',
    helpOption: '',
    mobileOrDesktop: '',
    issueType: '',
    name: '',
    email: '',
    walletAddress: '',
    company: '',
    uiIssueName: '',
    uiIssueEmail: '',
    uiIssueBrowser: '',
    uiIssueDescription: '',
    tokenSwapName: '',
    tokenSwapEmail: '',
    tokenSwapWalletAddress: '',
    tokenSwapToken: '',
    tokenSwapChain: '',
    tokenSwapIssueDescription: '',
    tokenSwapErrorCode: '',
    mobileWalletApp: '',
    mobileIssueDescription: '',
    desktopWalletProvider: '',
    desktopBrowser: '',
    multipleExtensions: '',
    clearedCache: '',
    clearedCacheIssueDescription: '',
    proposalFile: null,
    tokenIssueFile: null,
    uiIssueFile: null,
    tokenSwapFile: null,
    clearedCacheFile: null,
    walletConnectionFile: null,
  });

  const [createSupportRequest, { data, loading, error }] = useMutation(CREATE_SUPPORT_REQUEST, {
    client,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Reset dependent fields when certain fields change
    if (name === 'initialQuestion') {
      setFormState((prevState) => ({
        ...prevState,
        tokenIssue: '',
        helpOption: '',
        mobileOrDesktop: '',
        issueType: '',
      }));
    }

    if (name === 'tokenIssue') {
      setFormState((prevState) => ({
        ...prevState,
        helpOption: '',
        mobileOrDesktop: '',
        issueType: '',
      }));
    }

    if (name === 'issueType') {
      setFormState((prevState) => ({
        ...prevState,
        mobileOrDesktop: '',
      }));
    }
  };

  // Handle file uploads with validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      // Validate file size (max 8MB)
      if (file.size > 8 * 1024 * 1024) {
        setFormErrors('File size must be less than 8MB.');
        return;
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors('Only JPG, PNG, and GIF files are allowed.');
        return;
      }
      setFormState((prevState) => ({
        ...prevState,
        [name]: file,
      }));
      setFormErrors(null); // Clear previous errors
    }
  };

  // Form Submission Handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const walletAddressRegex = /^0x[a-fA-F0-9]{40}$/; // Example pattern for Ethereum addresses

    if (!emailRegex.test(formState.email)) {
      setFormErrors('Please enter a valid email address.');
      return;
    }

    if (formState.walletAddress && !walletAddressRegex.test(formState.walletAddress)) {
      setFormErrors('Please enter a valid wallet address.');
      return;
    }

    // Convert files to Base64 if present
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      const proposalFileBase64 = formState.proposalFile
        ? await fileToBase64(formState.proposalFile)
        : null;
      const tokenIssueFileBase64 = formState.tokenIssueFile
        ? await fileToBase64(formState.tokenIssueFile)
        : null;
      const uiIssueFileBase64 = formState.uiIssueFile
        ? await fileToBase64(formState.uiIssueFile)
        : null;
      const tokenSwapFileBase64 = formState.tokenSwapFile
        ? await fileToBase64(formState.tokenSwapFile)
        : null;
      const clearedCacheFileBase64 = formState.clearedCacheFile
        ? await fileToBase64(formState.clearedCacheFile)
        : null;
      const walletConnectionFileBase64 = formState.walletConnectionFile
        ? await fileToBase64(formState.walletConnectionFile)
        : null;

      await createSupportRequest({
        variables: {
          name:
            formState.initialQuestion === 'yes'
              ? formState.name
              : formState.issueType === 'UI Display Issue'
              ? formState.uiIssueName
              : formState.issueType === 'Token Swapping / Debt Repayment'
              ? formState.tokenSwapName
              : formState.issueType === 'Wallet Connection'
              ? formState.name
              : formState.name, // Default case
          email:
            formState.initialQuestion === 'yes'
              ? formState.email
              : formState.issueType === 'UI Display Issue'
              ? formState.uiIssueEmail
              : formState.issueType === 'Token Swapping / Debt Repayment'
              ? formState.tokenSwapEmail
              : formState.issueType === 'Wallet Connection'
              ? formState.email
              : formState.email, // Default case
          walletAddress:
            formState.initialQuestion === 'no'
              ? formState.walletAddress
              : formState.issueType === 'Token Swapping / Debt Repayment'
              ? formState.tokenSwapWalletAddress
              : formState.issueType === 'Wallet Connection'
              ? formState.walletAddress
              : null,
          token:
            formState.issueType === 'Token Swapping / Debt Repayment'
              ? formState.tokenSwapToken
              : null,
          tokenAmount: formState.tokenAmount || null,
          chain: formState.tokenSwapChain || null,
          helpOption: formState.helpOption || null,
          issueDescription:
            formState.initialQuestion === 'yes'
              ? formState.issueDescription
              : formState.issueType === 'UI Display Issue'
              ? formState.uiIssueDescription
              : formState.issueType === 'Token Swapping / Debt Repayment'
              ? formState.tokenSwapIssueDescription
              : formState.issueType === 'Wallet Connection'
              ? formState.clearedCacheIssueDescription
              : null,
          errorCode:
            formState.issueType === 'Token Swapping / Debt Repayment'
              ? formState.tokenSwapErrorCode
              : null,
          browser:
            formState.issueType === 'UI Display Issue'
              ? formState.uiIssueBrowser
              : formState.issueType === 'Wallet Connection'
              ? formState.desktopBrowser
              : null,
          walletProvider:
            formState.issueType === 'Wallet Connection'
              ? formState.desktopWalletProvider
              : null,
          walletApp:
            formState.issueType === 'Wallet Connection'
              ? formState.mobileWalletApp
              : null,
          multipleExtensions:
            formState.multipleExtensions === 'yes'
              ? true
              : formState.multipleExtensions === 'no'
              ? false
              : null,
          clearedCache:
            formState.clearedCache === 'yes'
              ? true
              : formState.clearedCache === 'no'
              ? false
              : null,
          proposalFile: proposalFileBase64,
          tokenIssueFile: tokenIssueFileBase64,
          uiIssueFile: uiIssueFileBase64,
          tokenSwapFile: tokenSwapFileBase64,
          clearedCacheFile: clearedCacheFileBase64,
          walletConnectionFile: walletConnectionFileBase64,
        },
      });

      setSuccessMessage('Your support request has been submitted successfully!');
      setFormErrors(null);
      // Optionally, reset the form
      setFormState({
        initialQuestion: '',
        tokenIssue: '',
        helpOption: '',
        mobileOrDesktop: '',
        issueType: '',
        name: '',
        email: '',
        walletAddress: '',
        company: '',
        uiIssueName: '',
        uiIssueEmail: '',
        uiIssueBrowser: '',
        uiIssueDescription: '',
        tokenSwapName: '',
        tokenSwapEmail: '',
        tokenSwapWalletAddress: '',
        tokenSwapToken: '',
        tokenSwapChain: '',
        tokenSwapIssueDescription: '',
        tokenSwapErrorCode: '',
        mobileWalletApp: '',
        mobileIssueDescription: '',
        desktopWalletProvider: '',
        desktopBrowser: '',
        multipleExtensions: '',
        clearedCache: '',
        clearedCacheIssueDescription: '',
        proposalFile: null,
        tokenIssueFile: null,
        uiIssueFile: null,
        tokenSwapFile: null,
        clearedCacheFile: null,
        walletConnectionFile: null,
      });
    } catch (err: any) {
      setFormErrors(err.message || 'An error occurred while submitting the form.');
      setSuccessMessage(null);
    }
  };

  // Determine visibility of form sections
  const canShowTokenFields = formState.tokenIssue === 'yes';
  const canShowProposalDescription =
    formState.initialQuestion === 'yes' &&
    formState.name.trim() !== '' &&
    formState.email.trim() !== '' &&
    formState.company.trim() !== '';
  const canShowUiIssueFields =
    formState.issueType === 'UI Display Issue' &&
    formState.uiIssueName.trim() !== '' &&
    formState.uiIssueEmail.trim() !== '' &&
    formState.uiIssueBrowser.trim() !== '';
  const canShowUiIssueDescription = canShowUiIssueFields;
  const canShowTokenSwapFields =
    formState.issueType === 'Token Swapping / Debt Repayment' &&
    formState.tokenSwapName.trim() !== '' &&
    formState.tokenSwapEmail.trim() !== '' &&
    formState.tokenSwapWalletAddress.trim() !== '';
  const canShowTokenSwapDetails =
    canShowTokenSwapFields &&
    formState.tokenSwapToken.trim() !== '' &&
    formState.tokenSwapChain.trim() !== '';
  const canShowTokenSwapDescription = canShowTokenSwapDetails;
  const canShowWalletConnectionFields =
    formState.issueType === 'Wallet Connection' &&
    formState.name.trim() !== '' &&
    formState.email.trim() !== '' &&
    formState.walletAddress.trim() !== '';
  const canShowMobileOrDesktopField =
    formState.issueType === 'Wallet Connection' && canShowWalletConnectionFields;
  const canShowMobileFields = formState.mobileOrDesktop === 'mobile';
  const canShowDesktopFields = formState.mobileOrDesktop === 'desktop';
  const canShowMultipleExtensionsField =
    canShowDesktopFields &&
    formState.desktopWalletProvider.trim() !== '' &&
    formState.desktopBrowser.trim() !== '';
  const canShowClearedCacheField =
    canShowMultipleExtensionsField && formState.multipleExtensions !== '';
  const canShowSubmitButtonWithDescription =
    formState.clearedCache !== '' ||
    canShowUiIssueDescription ||
    canShowTokenSwapDescription ||
    canShowMobileFields ||
    canShowProposalDescription ||
    canShowTokenFields;

  return (
    <form onSubmit={handleSubmit} className={styles['form-container']} aria-live="polite">
      {/* Display Success Message */}
      {successMessage && (
        <div className={styles['success-message']} role="alert">
          <Image
            src="/images/celebrating-purple.png"
            alt="Celebration"
            width={50}
            height={50}
            className={styles['icon']}
          />
          {successMessage}
        </div>
      )}

      {/* Display Error Message */}
      {formErrors && (
        <div className={styles['error-message']} role="alert">
          <Image
            src="/images/resting-purple.png"
            alt="Error"
            width={50}
            height={50}
            className={styles['icon']}
          />
          {formErrors}
        </div>
      )}
    <div className={styles.fieldWithSpace}>
      {/* Initial Question */}
      <SelectInput
        label="Is this a partnership or integration request?"
        id="initialQuestion"
        name="initialQuestion"
        value={formState.initialQuestion}
        onChange={handleChange}
        required
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
      />
      </div>
      {/* Partnership/Integration Request Flow */}
      {formState.initialQuestion === 'yes' && (
        <>
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        >
          <Image
            src="/images/holding-gem-purple.png"
            alt="Holding Gem"
            width={50}
            height={50}
            className={styles['icon']}
          />
          </motion.div>

          <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 0.33 }}
        >
          <TextInput
            label="Name"
            id="integrationName"
            name="name"
            type="text"
            placeholder="Your Name"
            value={formState.name}
            onChange={handleChange}
            required
          />
          </motion.div>

          <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 0.66 }}
        >
          <TextInput
            label="Email"
            id="integrationEmail"
            name="email"
            type="email"
            placeholder="Your Email"
            value={formState.email}
            onChange={handleChange}
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          />
          </motion.div>

          <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 1 }}
        >
          <TextInput
            label="Company You Represent"
            id="integrationCompany"
            name="company"
            type="text"
            placeholder="Your Company"
            value={formState.company}
            onChange={handleChange}
            required
          />
          </motion.div>

          {/* Show Proposal Description Box Only When Above Fields Are Filled */}
          {canShowProposalDescription && (
            <>
              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
              >
              <Image
                src="/images/hovering-ethereum-purple.png"
                alt="Hovering Ethereum"
                width={50}
                height={66}
                className={styles['icon']}
              />
              </motion.div>

              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.33 }}
              >
              <TextAreaInput
                label="Please describe your proposal (4096 characters max)"
                id="proposalDescription"
                name="issueDescription"
                placeholder="Describe your proposal"
                value={formState.issueDescription}
                onChange={handleChange}
                required
                maxLength={4096}
              />
              </motion.div>

              {/* File Upload Field */}
              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.66 }}
              >
              <FileInput
                label="Attach Supporting Document (Max 8MB, optional)"
                id="proposalFileUpload"
                name="proposalFile"
                onChange={handleFileChange}
              />
              </motion.div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles['submit-button']}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </>
          )}
        </>
      )}

      {/* Token Access Issue Question */}
      {formState.initialQuestion === 'no' && (
        <>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
              >
          <Image
            src="/images/holding-ethereum-purple.png"
            alt="Holding Ethereum"
            width={50}
            height={50}
            className={styles['icon']}
          />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.33 }}
              >
          <SelectInput
            label="Are you having issues accessing your tokens?"
            id="tokenIssue"
            name="tokenIssue"
            value={formState.tokenIssue}
            onChange={handleChange}
            required
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
          </motion.div>

          {/* Token Access Issue Flow */}
          {canShowTokenFields && (
            <>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3}}
              >
              <TextInput
                label="Name"
                id="tokenIssueName"
                name="name"
                type="text"
                placeholder="Your Name"
                value={formState.name}
                onChange={handleChange}
                required
              />
              </motion.div>

              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.33 }}
              >
              <TextInput
                label="Email"
                id="tokenIssueEmail"
                name="email"
                type="email"
                placeholder="Your Email"
                value={formState.email}
                onChange={handleChange}
                required
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              />
              </motion.div>

              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.66 }}
              >
              <TextInput
                label="Wallet Address"
                id="walletAddress"
                name="walletAddress"
                type="text"
                placeholder="Your Wallet Address"
                value={formState.walletAddress}
                onChange={handleChange}
                required
                pattern="^0x[a-fA-F0-9]{40}$" // Example pattern for Ethereum addresses
              />
              </motion.div>

              {/* File Upload Field */}
              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 1 }}
              >
              <FileInput
                label="Attach Screenshot (Max 8MB, optional)"
                id="tokenIssueFileUpload"
                name="tokenIssueFile"
                onChange={handleFileChange}
              />
              </motion.div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles['submit-button']}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </>
          )}

          {/* What Issue Are You Experiencing? */}
          {formState.tokenIssue === 'no' && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3}}
              >
            <SelectInput
              label="What issue are you experiencing?"
              id="issueType"
              name="issueType"
              value={formState.issueType}
              onChange={handleChange}
              required
              options={[
                { value: 'UI Display Issue', label: 'UI Display Issue' },
                { value: 'Token Swapping / Debt Repayment', label: 'Token Swapping / Debt Repayment' },
                { value: 'Wallet Connection', label: 'Wallet Connection' },
              ]}
            />
            </motion.div>
          )}
        </>
      )}

      {/* UI Display Issue Flow */}
      {formState.issueType === 'UI Display Issue' && (
        <>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3}}
              >
          <Image
            src="/images/laptop-purple.png"
            alt="Laptop"
            width={50}
            height={33}
            className={styles['icon']}
          />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.33 }}
              >
          <TextInput
            label="Name"
            id="uiIssueName"
            name="uiIssueName"
            type="text"
            placeholder="Your Name"
            value={formState.uiIssueName}
            onChange={handleChange}
            required
          />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.66 }}
              >
          <TextInput
            label="Email"
            id="uiIssueEmail"
            name="uiIssueEmail"
            type="email"
            placeholder="Your Email"
            value={formState.uiIssueEmail}
            onChange={handleChange}
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 1 }}
              >
          <TextInput
            label="Browser"
            id="uiIssueBrowser"
            name="uiIssueBrowser"
            type="text"
            placeholder="Your Browser"
            value={formState.uiIssueBrowser}
            onChange={handleChange}
            required
          />
          </motion.div>

          {/* Show Issue Description When Above Fields Are Filled */}
          {canShowUiIssueDescription && (
            <>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3}}
              >
              <TextAreaInput
                label="Please describe your issue (512 characters max)"
                id="uiIssueDescription"
                name="uiIssueDescription"
                placeholder="Describe your issue"
                value={formState.uiIssueDescription}
                onChange={handleChange}
                required
                maxLength={512}
              />
              </motion.div>

              {/* File Upload Field */}
              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.33 }}
              >
              <FileInput
                label="Attach Screenshot (Max 8MB, optional)"
                id="uiIssueFileUpload"
                name="uiIssueFile"
                onChange={handleFileChange}
              />
              </motion.div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles['submit-button']}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </>
          )}
        </>
      )}

      {/* Token Swapping / Debt Repayment Flow */}
      {formState.issueType === 'Token Swapping / Debt Repayment' && (
        <>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3}}
              >
          <Image
            src="/images/holding-gho-token-purple.png"
            alt="Purple Gho Token Ronnie"
            width={50}
            height={50}
            className={styles['icon']}
          />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.33 }}
              >
          <TextInput
            label="Name"
            id="tokenSwapName"
            name="tokenSwapName"
            type="text"
            placeholder="Your Name"
            value={formState.tokenSwapName}
            onChange={handleChange}
            required
          />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.66 }}
              >
          <TextInput
            label="Email"
            id="tokenSwapEmail"
            name="tokenSwapEmail"
            type="email"
            placeholder="Your Email"
            value={formState.tokenSwapEmail}
            onChange={handleChange}
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 1 }}
              >
          <TextInput
            label="Wallet Address"
            id="tokenSwapWalletAddress"
            name="tokenSwapWalletAddress"
            type="text"
            placeholder="Your Wallet Address"
            value={formState.tokenSwapWalletAddress}
            onChange={handleChange}
            required
            pattern="^0x[a-fA-F0-9]{40}$"
          />
          </motion.div>

          {/* Show Token and Chain Fields When Above Fields Are Filled */}
          {canShowTokenSwapFields && (
            <>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3}}
              >
              <TextInput
                label="Token Affected"
                id="tokenSwapToken"
                name="tokenSwapToken"
                type="text"
                placeholder="Affected Token"
                value={formState.tokenSwapToken}
                onChange={handleChange}
                required
              />
              </motion.div>

            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.33 }}
              >
              <TextInput
                label="Blockchain Network"
                id="tokenSwapChain"
                name="tokenSwapChain"
                type="text"
                placeholder="Blockchain Network"
                value={formState.tokenSwapChain}
                onChange={handleChange}
                required
              />
              </motion.div>
            </>
          )}

          {/* Show Issue Description and Error Code When Token and Chain Fields Are Filled */}
          {canShowTokenSwapDetails && (
            <>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3}}
              >
              <TextAreaInput
                label="Please describe your issue (512 characters max)"
                id="tokenSwapIssueDescription"
                name="tokenSwapIssueDescription"
                placeholder="Describe your issue"
                value={formState.tokenSwapIssueDescription}
                onChange={handleChange}
                required
                maxLength={512}
              />
              </motion.div>

              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.33 }}
              >
              <TextAreaInput
                label="Please paste the full error code here (16384 characters max)"
                id="tokenSwapErrorCode"
                name="tokenSwapErrorCode"
                placeholder="Paste the full error code"
                value={formState.tokenSwapErrorCode}
                onChange={handleChange}
                required
                maxLength={16384}
              />
              </motion.div>

              {/* File Upload Field */}
              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.66 }}
              >
              <FileInput
                label="Attach Screenshot (Max 8MB, optional)"
                id="tokenSwapFileUpload"
                name="tokenSwapFile"
                onChange={handleFileChange}
              />
              </motion.div>

              {/* Submit Button */}
              <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 1 }}
              >
              <button
                type="submit"
                className={styles['submit-button']}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              </motion.div>
            </>
          )}
        </>
      )}

      {/* Wallet Connection Flow */}
      {formState.issueType === 'Wallet Connection' && (
        <>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3}}
              >
          <Image
            src="/images/point-at-window-purple.png"
            alt="Ronnie Window Purple"
            width={66}
            height={50}
            className={styles['icon']}
          />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.33 }}
              >
          <TextInput
            label="Name"
            id="walletConnectionName"
            name="name"
            type="text"
            placeholder="Your Name"
            value={formState.name}
            onChange={handleChange}
            required
          />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 0.66 }}
              >
          <TextInput
            label="Email"
            id="walletConnectionEmail"
            name="email"
            type="email"
            placeholder="Your Email"
            value={formState.email}
            onChange={handleChange}
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 1 }}
              >
          <TextInput
            label="Wallet Address"
            id="walletConnectionWalletAddress"
            name="walletAddress"
            type="text"
            placeholder="Your Wallet Address"
            value={formState.walletAddress}
            onChange={handleChange}
            required
            pattern="^0x[a-fA-F0-9]{40}$"
          />
          </motion.div>

          {/* Show Mobile or Desktop Option When Above Fields Are Filled */}
          {canShowMobileOrDesktopField && (
            <>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3}}
              >
              <SelectInput
                label="Are you on mobile or desktop?"
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
              </motion.div>

              {/* Mobile Specific Fields */}
              {canShowMobileFields && (
                <>
                <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3}}
                >
                  <Image
                    src="/images/hovering-heart-purple.png"
                    alt="Hovering Heart"
                    width={40}
                    height={50}
                    className={styles['icon']}
                  />
                  </motion.div>

                  <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 0.33 }}
                  >
                  <TextInput
                    label="Wallet App"
                    id="mobileWalletApp"
                    name="mobileWalletApp"
                    type="text"
                    placeholder="Wallet App"
                    value={formState.mobileWalletApp}
                    onChange={handleChange}
                    required
                  />
                  </motion.div>

                  <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 0.66 }}
                  >
                  <TextAreaInput
                    label="Please describe your issue (256 characters max)"
                    id="mobileIssueDescription"
                    name="mobileIssueDescription"
                    placeholder="Describe your issue"
                    value={formState.mobileIssueDescription}
                    onChange={handleChange}
                    required
                    maxLength={256}
                  />
                  </motion.div>

                  {/* File Upload Field */}
                  <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 1 }}
                  >
                  <FileInput
                    label="Attach Screenshot (Max 8MB, optional)"
                    id="walletConnectionFileUpload"
                    name="walletConnectionFile"
                    onChange={handleFileChange}
                  />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 1.33 }}
                  >
                  <button
                    type="submit"
                    className={styles['submit-button']}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                  </motion.div>
                </>
              )}

              {/* Desktop Specific Fields */}
              {canShowDesktopFields && (
                <>
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3}}
                  >
                  <Image
                    src="/images/two-ronnies-with-chart-purple.png"
                    alt="Pointing at Window"
                    width={66}
                    height={50}
                    className={styles['icon']}
                  />
                  </motion.div>

                  <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 0.33 }}
                  >
                  <TextInput
                    label="Wallet Provider"
                    id="desktopWalletProvider"
                    name="desktopWalletProvider"
                    type="text"
                    placeholder="Wallet Provider"
                    value={formState.desktopWalletProvider}
                    onChange={handleChange}
                    required
                  />
                  </motion.div>

                  <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, delay: 0.66 }}
                  >
                  <TextInput
                    label="Browser"
                    id="desktopBrowser"
                    name="desktopBrowser"
                    type="text"
                    placeholder="Browser"
                    value={formState.desktopBrowser}
                    onChange={handleChange}
                    required
                  />
                  </motion.div>

                  {/* Show Multiple Wallet Extensions Field When Desktop Fields Are Filled */}
                  {canShowMultipleExtensionsField && (
                    <>
                    <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 3}}
                    >
                      <SelectInput
                        label="Do you have multiple wallet extensions enabled?"
                        id="multipleExtensions"
                        name="multipleExtensions"
                        value={formState.multipleExtensions}
                        onChange={handleChange}
                        required
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' },
                        ]}
                      />
                      </motion.div>

                      {/* Show Cleared Cache Field When Multiple Extensions Field is Selected */}
                      {canShowClearedCacheField && (
                        <>
                        <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 3}}
                        >
                          <SelectInput
                            label="Did you attempt clearing browser cache and cookies?"
                            id="clearedCache"
                            name="clearedCache"
                            value={formState.clearedCache}
                            onChange={handleChange}
                            required
                            options={[
                              { value: 'yes', label: 'Yes' },
                              { value: 'no', label: 'No' },
                            ]}
                          />
                          </motion.div>

                          {/* Show Issue Description and File Upload When "Yes" or "No" is Selected */}
                          {formState.clearedCache !== '' && (
                            <>
                            <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 3}}
                            >
                              <Image
                                src="/images/waving-aave-hat-purple.png"
                                alt="Red Semicircles"
                                width={33}
                                height={50}
                                className={styles['icon']}
                              />
                              </motion.div>

                              <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 3, delay:0.33}}
                              >
                              <TextAreaInput
                                label="Please describe your issue (512 characters max)"
                                id="clearedCacheIssueDescription"
                                name="clearedCacheIssueDescription"
                                placeholder="Describe your issue"
                                value={formState.clearedCacheIssueDescription}
                                onChange={handleChange}
                                required
                                maxLength={512}
                              />
                              </motion.div>

                              {/* File Upload Field */}
                              <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 3, delay: 0.66}}
                              >
                              <FileInput
                                label="Attach Screenshot (Max 8MB, optional)"
                                id="clearedCacheFileUpload"
                                name="clearedCacheFile"
                                onChange={handleFileChange}
                              />
                              </motion.div>

                              {/* Submit Button */}
                              <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 3, delay: 1}}
                              >
                              <button
                                type="submit"
                                className={styles['submit-button']}
                                disabled={loading}
                                aria-busy={loading}
                              >
                                {loading ? 'Submitting...' : 'Submit'}
                              </button>
                              </motion.div>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </form>
  );
};

export default SupportForm;
