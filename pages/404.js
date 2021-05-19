import React from 'react';
import Link from 'next/link';

export default function custom404() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>
        404 - Page Not Found.
      </h1>
      <p>
        Click
        {' '}
        <Link href="/"><u><a>here</a></u></Link>
        {' '}
        to go back
      </p>
    </div>
  );
}
