// src/components/NavItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/header.module.css';

interface LinkItem {
  href: string;
  label: string;
}

interface NavItemProps {
  title: string;
  links: LinkItem[];
}

const NavItem: React.FC<NavItemProps> = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItemRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (navItemRef.current && !navItemRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className={styles.navItem}
      ref={navItemRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={styles.navButton}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        {title}
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu} role="menu">
          {links.map((link) => (
            <Link key={link.href} href={link.href} role="menuitem" className={styles.dropdownLink}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItem;
