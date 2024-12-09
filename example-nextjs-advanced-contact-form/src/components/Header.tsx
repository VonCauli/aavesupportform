// src/components/Header.tsx
import React from 'react';
import NavItem from './NavItem';
import styles from '../styles/header.module.css';
import Image from 'next/image';
import Link from 'next/link'; // Ensure Link is imported

const Header: React.FC = () => {
  const navItems = [
    {
      title: 'Products',
      links: [
        { href: '/products/borrow', label: 'Borrow' },
        { href: '/products/deposit', label: 'Deposit' },
        { href: '/products/staking', label: 'Staking' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { href: '/developers/docs', label: 'Documentation' },
        { href: '/developers/sdk', label: 'SDK' },
        { href: '/developers/api', label: 'API' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { href: '/resources/blog', label: 'Blog' },
        { href: '/resources/faq', label: 'FAQ' },
        { href: '/resources/community', label: 'Community' },
      ],
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/logo-dark.svg"
            alt="AAVE Logo"
            fill
            style={{ objectFit: 'contain' }}
            className={styles.logo}
          />
        </div>
        
        {/* New Element for "AAVE Support Center" */}
        <div className={styles.siteTitle}>
          AAVE Support Center
        </div>
        
        <nav className={styles.navMenu} role="menubar">
          {navItems.map((item) => (
            <NavItem key={item.title} title={item.title} links={item.links} />
          ))}
          
          {/* New "Open App" Button */}
          <Link
            href="https://app.aave.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.openAppButton}
          >
            Open App
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
