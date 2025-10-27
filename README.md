# 资源分享网

一个极客风格的资源分享导航网站，纯前端实现，自适应布局，支持多种搜索引擎切换。

## 功能特点

- **黑白极客风格**：简洁的黑白配色，以文字为主的极简设计
- **分类系统**：明确的主分类和子分类结构
- **搜索功能**：
  - 站内搜索：快速查找站内资源
  - 站外搜索：支持必应、百度、抖音、B站、知乎等多种搜索引擎
- **响应式设计**：适配各种屏幕尺寸的设备
- **JSON数据存储**：所有分类和资源数据通过JSON格式存储，易于维护和扩展

## 项目结构

```
├── index.html          # 主页面
├── styles.css          # 样式表
├── app.js              # 主要JavaScript逻辑
├── search-engine.js    # 搜索引擎切换功能
├── data.js             # 网站数据（分类和资源）
└── README.md           # 项目说明文档
```

## 使用方法

1. 直接在浏览器中打开 `index.html` 文件即可访问网站
2. 无需服务器环境，纯静态页面

## 自定义内容

### 添加新分类

在 `data.js` 文件中的 `websiteData.categories` 数组中添加新的分类对象：

```javascript
{
    id: "your-category-id",
    name: "分类名称",
    subcategories: [
        { id: "subcategory-id-1", name: "子分类名称1" },
        { id: "subcategory-id-2", name: "子分类名称2" }
    ]
}
```

### 添加新资源

在 `data.js` 文件中的 `websiteData.resources` 数组中添加新的资源对象：

```javascript
{
    id: "unique-id",
    title: "资源标题",
    description: "资源描述",
    url: "https://resource-url.com",
    category: "category-id",
    subcategory: "subcategory-id",
    tags: ["标签1", "标签2"]
}
```

## 自定义样式

可以通过修改 `styles.css` 文件中的 CSS 变量来自定义网站的颜色方案：

```css
:root {
    --bg-color: #121212;        /* 背景颜色 */
    --text-color: #e0e0e0;       /* 文字颜色 */
    --accent-color: #4caf50;     /* 强调色 */
    --secondary-bg: #1e1e1e;     /* 次要背景色 */
    --border-color: #333;        /* 边框颜色 */
    --hover-color: #2a2a2a;      /* 悬停颜色 */
    --link-color: #8ab4f8;       /* 链接颜色 */
}
```

## 扩展功能

- 可以通过修改 `search-engine.js` 文件添加更多搜索引擎
- 可以在 `app.js` 中添加更多交互功能，如资源排序、筛选等
- 可以添加本地存储功能，保存用户的浏览偏好

## 注意事项

- 本项目为纯前端实现，所有数据都存储在客户端
- 如需添加大量资源，建议考虑使用后端服务或数据库