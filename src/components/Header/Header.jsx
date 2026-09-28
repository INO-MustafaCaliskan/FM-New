


"use client"
import React from 'react';
import { Navbar, Nav, NavDropdown, Button, Container } from 'react-bootstrap';
import './header.css';
import { useState } from "react";
import Image from 'next/image';
import InoButton from '../Buttons/InoButton';
import Link from 'next/link';
import { usePathname } from "next/navigation";

const handleClick = (buttonUrl) => {
  window.location.href = buttonUrl;
};

const Header = () => {
  const pathName = usePathname();

  return (
    <header>

      <Container >

        <Navbar expand="lg" className=''>
          <Navbar.Brand href="/">
            <Image
              src="/images/FM_Logo.png"
              alt="Freight Midpoint"
              width={280}
              height={80}
              priority
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarSupportedContent" />
          <Navbar.Collapse id="navbarSupportedContent" className="justify-content-end">
            <Nav className="header-nav-items mb-2 mb-lg-0 ">
              <div className='navbar-collapse-mobile'>
                <Link href="/global-networkers" data-page-number-no-auth="4" className={pathName?.startsWith("/global-networkers") ? "active-nav-link" : ""}>Global Networkers</Link>
              </div>
              <div className='navbar-collapse-mobile'>
                <Link href="/pricing" data-page-number-no-auth="2" className={pathName?.startsWith("/pricing") ? "active-nav-link" : ""}>Pricing</Link>
              </div>


              <div className='navbar-collapse-mobile'>
                <Link href="/get-verified" data-page-number-no-auth="3" className={pathName?.startsWith("/get-verified") ? "active-nav-link" : ""}>Get Verified</Link>
              </div>
              <div className='navbar-collapse-mobile'>
                <Link href="/faq" data-page-number-no-auth="3" className={pathName?.startsWith("/faq") || pathName?.startsWith("/verification") ? "active-nav-link" : ""}>FAQ</Link>
              </div>


              <div className='navbar-collapse-mobile'>
                <Link href="/sign-in" className="header-sign-in-btn">Sign In</Link>
              </div>

              <InoButton className="navbar-collapse-btn" title="Try It For Free" onClick={() => handleClick("/sign-up")} />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
