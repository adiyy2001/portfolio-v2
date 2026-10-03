const fs = require('fs');
const path = require('path');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type MarkdownRemarkFrontmatter {
      slug: String
      tags: [String]
      showInProjects: Boolean
      draft: Boolean
      date: Date @dateformat
      description: String
      ios: String
      android: String
      company: String
    }
  `);
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

exports.onPostBuild = () => {
  htmlFiles(path.join(__dirname, 'public')).forEach(file => {
    const sources = [];
    const html = fs.readFileSync(file, 'utf8').replace(entryScript, (tag, source) => {
      sources.push(source);
      return '';
    });
    if (sources.length) {
      fs.writeFileSync(file, html.replace('</body>', `${afterFirstPaint(sources)}</body>`));
    }
  });
};
