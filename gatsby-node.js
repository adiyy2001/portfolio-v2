const fs = require('fs');
const path = require('path');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type MarkdownRemarkFrontmatter {
      title: String
      slug: String
      tags: [String]
      showInProjects: Boolean
      draft: Boolean
      date: Date @dateformat
      updated: Date @dateformat
      description: String
      ogImage: File @fileByRelativePath
      ios: String
      android: String
      company: String
    }
  `);
};

const blogQuery = `
  query {
    site {
      siteMetadata {
        siteUrl
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/blog/" }, frontmatter: { draft: { ne: true } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        html
        fileAbsolutePath
        frontmatter {
          title
          description
          date
          updated
          slug
          tags
        }
      }
    }
  }
`;

const blogSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const blogProblems = post => {
  const { title, description, date, slug } = post.frontmatter;
  const folder = path.basename(path.dirname(post.fileAbsolutePath));
  const problems = [];
  if (!title) problems.push('title is missing');
  if (title?.includes('|')) problems.push('title must not contain a vertical bar');
  if (!description) problems.push('description is missing');
  if (!date) problems.push('date is missing');
  if (!slug || !blogSlug.test(slug))
    problems.push('slug must be lowercase words joined with hyphens');
  if (slug !== folder) problems.push(`slug must match the folder name "${folder}"`);
  return problems;
};

const blogPosts = async (graphql, reporter) => {
  const result = await graphql(blogQuery);
  if (result.errors) {
    reporter.panicOnBuild('Blog query failed', result.errors);
    return { siteUrl: '', posts: [] };
  }
  const posts = result.data.allMarkdownRemark.nodes;
  posts.forEach(post => {
    const problems = blogProblems(post);
    if (problems.length) {
      reporter.panicOnBuild(`Blog post ${post.fileAbsolutePath}: ${problems.join(', ')}`);
    }
  });
  return { siteUrl: result.data.site.siteMetadata.siteUrl, posts };
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { posts } = await blogPosts(graphql, reporter);
  if (!posts.length) return;
  actions.createPage({
    path: '/blog/',
    component: path.resolve(__dirname, 'src/templates/blog.js'),
  });
  posts.forEach(post => {
    actions.createPage({
      path: `/blog/${post.frontmatter.slug}/`,
      component: path.resolve(__dirname, 'src/templates/post.js'),
      context: { id: post.id },
    });
  });
};

const xmlEntities = { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' };

const xml = text => String(text).replace(/[<>&'"]/g, char => xmlEntities[char]);

const cdata = text => `<![CDATA[${String(text).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

const absolute = (html, siteUrl) => html.replace(/(src|href)="\//g, `$1="${siteUrl}/`);

const feed = (posts, siteUrl) => {
  const items = posts
    .map(({ html, frontmatter: post }) => {
      const link = `${siteUrl}/blog/${post.slug}/`;
      const tags = (post.tags ?? []).map(tag => `      <category>${xml(tag)}</category>`);
      return [
        '    <item>',
        `      <title>${xml(post.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `      <description>${xml(post.description)}</description>`,
        ...tags,
        `      <content:encoded>${cdata(absolute(html, siteUrl))}</content:encoded>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    '    <title>Adrian Turbiński, blog</title>',
    `    <link>${siteUrl}/blog/</link>`,
    `    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />`,
    '    <description>Articles by Adrian Turbiński, a frontend developer and tech lead from Wrocław.</description>',
    '    <language>en</language>',
    `    <lastBuildDate>${new Date(posts[0].frontmatter.date).toUTCString()}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
};

const llmsBlog = (posts, siteUrl) =>
  [
    '',
    '## Blog',
    '',
    `- [Blog](${siteUrl}/blog/): articles in English, also as [RSS](${siteUrl}/blog/rss.xml)`,
    ...posts
      .slice(0, 10)
      .map(
        ({ frontmatter: post }) =>
          `- [${post.title}](${siteUrl}/blog/${post.slug}/): ${post.description}`,
      ),
    '',
  ].join('\n');

const writeBlogFiles = ({ posts, siteUrl }) => {
  if (!posts.length) return;
  const publicDir = path.join(__dirname, 'public');
  fs.writeFileSync(path.join(publicDir, 'blog', 'rss.xml'), feed(posts, siteUrl));
  const llms = path.join(publicDir, 'llms.txt');
  if (fs.existsSync(llms)) {
    fs.writeFileSync(
      llms,
      fs.readFileSync(llms, 'utf8').trimEnd() + '\n' + llmsBlog(posts, siteUrl),
    );
  }
};

const entryScript =
  /<script src="([^"]*\/(?:webpack-runtime|framework|app)-[0-9a-f]+\.js)" async><\/script>/g;

const afterFirstPaint = sources =>
  `<script>!function(){var s=${JSON.stringify(sources)},d=0;function load(){if(d)return;d=1;s.forEach(function(u){var e=document.createElement("script");e.src=u;e.async=true;document.body.appendChild(e)})}try{var o=new PerformanceObserver(function(l){l.getEntries().some(function(e){return e.name==="first-contentful-paint"})&&(o.disconnect(),load())});o.observe({type:"paint",buffered:true})}catch(e){load()}setTimeout(load,1500)}()</script>`;

const htmlFiles = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '_gatsby' ? [] : htmlFiles(file);
    return entry.name.endsWith('.html') ? [file] : [];
  });

const streamPadding = /\0/g;

exports.onPostBuild = async ({ graphql, reporter }) => {
  writeBlogFiles(await blogPosts(graphql, reporter));
  htmlFiles(path.join(__dirname, 'public')).forEach(file => {
    const sources = [];
    const html = fs
      .readFileSync(file, 'utf8')
      .replace(streamPadding, '')
      .replace(entryScript, (tag, source) => {
        sources.push(source);
        return '';
      });
    fs.writeFileSync(
      file,
      sources.length ? html.replace('</body>', `${afterFirstPaint(sources)}</body>`) : html,
    );
  });
};
