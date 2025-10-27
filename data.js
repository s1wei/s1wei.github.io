// 动态加载 src 目录下各分类 JSON，组装为 websiteData
(function() {
  window.websiteData = { categories: [], resources: [] };

  window.loadWebsiteData = async function() {
    const files = [
      'src/personal.json',
      'src/web-tools.json',
      'src/game-resources.json',
      'src/pc-tools.json',
      'src/mobile-tools.json',
      'src/cs-learning.json',
      'src/chinese-studies.json',
      'src/others.json'
    ];
    try {
      const results = await Promise.all(
        files.map(p => fetch(p).then(r => {
          if (!r.ok) throw new Error('加载失败: ' + p);
          return r.json();
        }))
      );
      const categories = [];
      const resources = [];
      results.forEach(r => {
        if (r.category) categories.push(r.category);
        if (Array.isArray(r.resources)) resources.push(...r.resources);
      });
      window.websiteData.categories = categories;
      window.websiteData.resources = resources;
    } catch (e) {
      console.error('加载 JSON 数据失败：', e);
      // 失败时维持空数据，页面将初始化但显示空状态
    }
  };
})();