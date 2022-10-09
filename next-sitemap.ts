/** @type {import('next-sitemap').IConfig} */
/* eslint-disable import/no-anonymous-default-export */

export default {
  siteUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
  generateRobotsTxt: true, // (optional)
  sitemapSize: 7000, // (optional)
  sitemapBaseFileName: 'sitemap', // (optional)
  sitemapPath: '/sitemap.xml', // (optional)
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/secret'
      },
      {
        userAgent: '*',
        allow: '/'
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 2,
        sitemap: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/sitemap.xml`
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 2,
        sitemap: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/sitemap.xml`
      }
    ]
  }
}
