const safeUrl = /^(?:https?:|mailto:|#|\/(?!\/))/i;

const isBlogPost = markdownNode =>
  /[\\/]content[\\/]blog[\\/]/.test(markdownNode.fileAbsolutePath || '');

const clean = node => {
  if (typeof node.url === 'string' && !safeUrl.test(node.url.trim())) node.url = '#';
  if (!node.children) return;
  node.children = node.children.filter(child => child.type !== 'html');
  node.children.forEach(clean);
};

module.exports = ({ markdownAST, markdownNode }) => {
  if (isBlogPost(markdownNode)) clean(markdownAST);
  return markdownAST;
};
