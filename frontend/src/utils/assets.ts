/**
 * 获取资源路径
 * 在 GitHub Pages 部署时会自动添加仓库名前缀
 */
export const getAssetPath = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  // 移除路径开头的 /
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // 确保 base 以 / 结尾
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
};
