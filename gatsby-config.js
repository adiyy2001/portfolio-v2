const { execFileSync } = require('child_process');

const lastChange = (...paths) => {
  try {
    return (
      execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], {
        encoding: 'utf8',
      }).trim() || undefined
    );
  } catch {
    return undefined;
  }
};

const servicePaths = /^\/(uslugi|en\/services)\//;

const briefPage = '/en/website-brief/';

module.exports = {
  siteMetadata: {
    title: 'Adrian Turbiński',
    siteUrl: 'https://adrianturbinski.pl',
    goatcounter: 'adrianturbinski',
    analytics: 'G-YPZS4964X7',
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        excludes: ['/dla-klienta/', '/en/for-clients/', '/wycena/wyslano/', '/en/quote/sent/'],
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
                component
              }
            }
            allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/content/(blog|poradnik)/" } }) {
              nodes {
                fileAbsolutePath
                frontmatter {
                  slug
                  date
                  updated
                }
              }
            }
          }
        `,
        resolvePages: ({ allSitePage, allMarkdownRemark }) => {
          const section = file =>
            /[\\/]content[\\/]poradnik[\\/]/.test(file) ? 'poradnik' : 'blog';
          const posts = new Map(
            allMarkdownRemark.nodes.map(({ fileAbsolutePath, frontmatter: f }) => [
              `/${section(fileAbsolutePath)}/${f.slug}/`,
              f.updated || f.date,
            ]),
          );
          const newest = prefix =>
            [...posts]
              .filter(([path]) => path.startsWith(prefix))
              .map(([, date]) => date)
              .sort()
              .pop();
          const pages = allSitePage.nodes.map(({ path, component }) => ({
            path,
            lastmod:
              posts.get(path) ??
              (path === '/blog/' || path === '/poradnik/'
                ? newest(path)
                : servicePaths.test(path)
                  ? lastChange(component, 'src/services.js', 'src/components/service.js')
                  : path === briefPage
                    ? lastChange(component, 'src/brief.js')
                    : lastChange(component)),
          }));
          return [...pages, { path: '/wzornik/', lastmod: lastChange('sites') }];
        },
        serialize: ({ path, lastmod }) => ({ url: path, lastmod }),
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: '*', allow: '/', disallow: ['/wzornik/*.pdf$', '/wzornik/*.zip$'] }],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-safe-blog',
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow noopener noreferrer',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 700,
              linkImagesToOriginal: true,
              quality: 90,
            },
          },
        ],
      },
    },
  ],
};
