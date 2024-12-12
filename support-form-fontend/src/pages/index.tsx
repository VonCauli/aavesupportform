import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import SupportForm from '../components/contactForm';
import Header from '../components/Header';
import styles from '../styles/contactForm.module.css';


const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Support Form</title>
        <meta name="description" content="Get support using our form." />
      </Head>
      <Header />
      <main>
        {/* Support Form */}
        <SupportForm />
      </main>
    </div>
  );
};

export default Home;
