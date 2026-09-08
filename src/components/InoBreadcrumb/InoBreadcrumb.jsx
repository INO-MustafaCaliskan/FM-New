

"use client";

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import './inobreadcrumb.css'

function InoBreadcrumb({ linkName, subRoots, id }) {
  return (
    <div className="pt-3 pb-3" id={id}>
      <Breadcrumb className='ino-breadcrumb'>
        <Breadcrumb.Item className='root-title' href="/global-networkers">Homepage</Breadcrumb.Item>
        {subRoots && subRoots.map((subRoot, index) => (
          <Breadcrumb.Item key={index} href={subRoot.href}>{subRoot.name}</Breadcrumb.Item>
        ))}
        <Breadcrumb.Item active >{linkName}</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}

export default InoBreadcrumb;


// import { useRouter } from 'next/router';

// function Page() {
//   const router = useRouter();
//   const { pathname } = router;
//   const pageName = getPageNameFromPath(pathname); // Sayfa adını almak için bir fonksiyon

//   return (
//     <div className='container'>
//       <InoBreadcrumb linkName={pageName} />
//       <div className="card">
//         {/* İçerik */}
//       </div>
//     </div>
//   );
// }
