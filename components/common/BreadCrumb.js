import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function BreadCrumb() {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/');
      linkPath.shift();
      const pathArray = linkPath.map((path, i) => ({ breadcrumb: path, href: `/${linkPath.slice(0, i + 1).join('/')}` }));
      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <nav aria-label="breadcrumbs">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="/">Main</a>
        </li>
        {breadcrumbs.map((breadcrumb) => (
          <li className="breadcrumb-item" key={breadcrumb.href}>
            <Link href={breadcrumb.href}>
              <a>
                {breadcrumb.breadcrumb}
              </a>
            </Link>
          </li>
        ))}
      </ol>
    </nav>

  );
}
