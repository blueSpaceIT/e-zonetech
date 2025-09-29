import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import NewsletterList from 'src/components/_admin/newsletter/newsletterList';
// Meta information
export const metadata = {
  title: 'Newsletter - Ezone',
  applicationName: 'Ezone',
  authors: 'Ezone'
};
export default function page() {
  return (
    <div>
      {' '}
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Newsletter List"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'newsletter'
            }
          ]}
        />
      </Toolbar>
      <NewsletterList />
    </div>
  );
}
