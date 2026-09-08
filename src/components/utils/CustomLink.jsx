'use client';
import React, { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link';

const CustomLink = ({children, href, updateLocation, ...props}) => {
    const router = useRouter();
    const pathName = usePathname();
    const path = useRef(pathName);

    useEffect(() => {
        path.current = pathName;
    }, [pathName])

    const handleClick = (e) => {
        e.preventDefault();
    
        const body = document.querySelector('body');

     
        if(path.current === href) {
            return;
        }

        body?.classList.add('page-transition');

        if(updateLocation)
            window.location.href = href;
        else{
            router.push(href);
            setTimeout(() => {
                body.classList.remove('page-transition')
            }, 300);
        }

    }
  return (
    <Link href={href} onClick={handleClick} {...props}>{children}</Link>
  )
}

export default CustomLink;