import React from 'react';
import Moved, { MovedHead } from '../../components/moved';

// /en/contact/ did not exist (404, 31.10.2026); contact and quote live on the home page.
export default function Contact() {
  return <Moved lang="en" kind="contact" hash="#quote" />;
}

export const Head = () => <MovedHead lang="en" kind="contact" hash="#quote" />;
