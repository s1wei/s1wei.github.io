document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const categoriesContainer = document.getElementById('categories');
    const subcategoriesContainer = document.getElementById('subcategories');
    const resourcesContainer = document.getElementById('resources');
    const currentCategoryTitle = document.getElementById('currentCategory');
    const engineButtons = document.querySelectorAll('.engine-btn');
    
    // 当前选中的分类和子分类
    let currentCategory = 'all';
    let currentSubcategory = 'all';
    let currentEngine = 'bing'; // 默认搜索引擎
    
    // 初始化页面（等待数据加载完成）
    if (typeof window.loadWebsiteData === 'function') {
        window.loadWebsiteData().then(() => {
            initializePage();
        }).catch(() => {
            // 即便加载失败也尝试初始化（便于回退到内置数据或空状态）
            initializePage();
        });
    } else {
        initializePage();
    }
    
    // 初始化页面函数
    function initializePage() {
        // 加载分类
        loadCategories();
        
        // 加载所有资源
        loadResources();
        
        // 设置搜索引擎切换事件
        setupEngineButtons();
        
        // 设置动态搜索功能
        setupDynamicSearch();
    }
    
    // 加载分类函数
    function loadCategories() {
        // 创建"全部"分类按钮
        const allCategoryBtn = document.createElement('button');
        allCategoryBtn.textContent = '全部';
        allCategoryBtn.classList.add('category-btn', 'active');
        allCategoryBtn.dataset.category = 'all';
        categoriesContainer.appendChild(allCategoryBtn);
        
        // 加载其他分类
        websiteData.categories.forEach(category => {
            const btn = document.createElement('button');
            btn.textContent = category.name;
            btn.classList.add('category-btn');
            btn.dataset.category = category.id;
            categoriesContainer.appendChild(btn);
        });
        
        // 添加分类点击事件
        const categoryButtons = categoriesContainer.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // 移除所有active类
                categoryButtons.forEach(b => b.classList.remove('active'));
                
                // 添加active类到当前点击的按钮
                this.classList.add('active');
                
                // 更新当前分类
                currentCategory = this.dataset.category;
                currentSubcategory = 'all';
                
                // 更新标题
                updateCategoryTitle();
                
                // 加载子分类
                loadSubcategories();
                
                // 加载资源
                loadResources();
            });
        });
    }
    
    // 加载子分类函数
    function loadSubcategories() {
        // 清空子分类容器
        subcategoriesContainer.innerHTML = '';
        
        // 如果是全部分类或没有子分类，则隐藏子分类区域
        if (currentCategory === 'all') {
            subcategoriesContainer.style.display = 'none';
            return;
        }
        
        // 查找当前分类
        const category = websiteData.categories.find(cat => cat.id === currentCategory);
        
        // 如果没有子分类，则隐藏子分类区域
        if (!category || !category.subcategories || category.subcategories.length === 0) {
            subcategoriesContainer.style.display = 'none';
            return;
        }
        
        // 显示子分类区域
        subcategoriesContainer.style.display = 'inline-flex';
        
        // 创建子分类标签
        const subcatLabel = document.createElement('span');
        subcatLabel.textContent = '/';
        subcatLabel.style.margin = '0 4px';
        subcatLabel.style.color = '#666';
        subcategoriesContainer.appendChild(subcatLabel);
        
        // 创建"全部"子分类按钮
        const allSubcategoryBtn = document.createElement('button');
        allSubcategoryBtn.classList.add('subcategory-btn', 'active');
        allSubcategoryBtn.textContent = '全部';
        allSubcategoryBtn.dataset.subcategory = 'all';
        subcategoriesContainer.appendChild(allSubcategoryBtn);
        
        // 加载其他子分类
        category.subcategories.forEach(subcategory => {
            const btn = document.createElement('button');
            btn.classList.add('subcategory-btn');
            btn.textContent = subcategory.name;
            btn.dataset.subcategory = subcategory.id;
            subcategoriesContainer.appendChild(btn);
        });
        
        // 添加子分类点击事件
        const subcategoryButtons = subcategoriesContainer.querySelectorAll('.subcategory-btn');
        subcategoryButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // 移除所有active类
                subcategoryButtons.forEach(b => b.classList.remove('active'));
                
                // 添加active类到当前点击的按钮
                this.classList.add('active');
                
                // 更新当前子分类
                currentSubcategory = this.dataset.subcategory;
                
                // 加载资源
                loadResources();
            });
        });
    }
    
    // 加载资源函数
    function loadResources() {
        // 清空资源容器
        resourcesContainer.innerHTML = '';
        
        // 筛选资源
        let filteredResources = websiteData.resources;
        
        // 按分类筛选
        if (currentCategory !== 'all') {
            filteredResources = filteredResources.filter(resource => resource.category === currentCategory);
            
            // 按子分类筛选
            if (currentSubcategory !== 'all') {
                filteredResources = filteredResources.filter(resource => resource.subcategory === currentSubcategory);
            }
        }
        
        // 如果没有资源，显示提示信息
        if (filteredResources.length === 0) {
            const noResourcesMsg = document.createElement('div');
            noResourcesMsg.classList.add('no-resources-message');
            noResourcesMsg.textContent = '没有找到相关资源';
            resourcesContainer.appendChild(noResourcesMsg);
            return;
        }
        
        // 显示资源
        filteredResources.forEach(resource => {
            const resourceCard = createResourceCard(resource);
            resourcesContainer.appendChild(resourceCard);
        });
    }
    
    // 创建资源卡片函数
    function createResourceCard(resource) {
        const card = document.createElement('div');
        card.classList.add('resource-card');
        
        // 所有资源都使用统一的蓝色样式，并通过弹窗选择
        const titleElement = document.createElement('div');
        titleElement.textContent = resource.title;
        titleElement.style.cursor = 'pointer';
        titleElement.style.color = 'var(--link-color)'; // 统一使用蓝色
        
        // 点击时弹出选择窗口（包括单链接）
        titleElement.addEventListener('click', function() {
            showLinkModal(resource);
            // 点击后标记为已访问（仅会话内，不持久化）
            this.classList.add('visited');
        });
        
        card.appendChild(titleElement);
        
        return card;
    }
    
    // 更新分类标题
    function updateCategoryTitle() {
        if (currentCategory === 'all') {
            currentCategoryTitle.textContent = '所有资源';
        } else {
            const category = websiteData.categories.find(cat => cat.id === currentCategory);
            if (category) {
                currentCategoryTitle.textContent = category.name;
            }
        }
    }
    
    // 设置搜索引擎按钮
    function setupEngineButtons() {
        engineButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // 移除所有active类
                engineButtons.forEach(b => b.classList.remove('active'));
                
                // 添加active类到当前点击的按钮
                this.classList.add('active');
                
                // 更新当前搜索引擎
                const engine = this.dataset.engine;
                currentEngine = engine;
                
                // 根据引擎修改表单action和参数名
                switch (engine) {
                    case 'baidu':
                        searchForm.action = 'https://www.baidu.com/s';
                        searchInput.name = 'wd';
                        searchForm.onsubmit = null; // 清除之前可能的自定义提交事件
                        break;
                    case 'bing':
                        searchForm.action = 'https://www.bing.com/search';
                        searchInput.name = 'q';
                        searchForm.onsubmit = null; // 清除之前可能的自定义提交事件
                        break;
                    case 'douyin':
                        searchForm.action = 'https://www.douyin.com/search/';
                        // 抖音搜索不使用查询参数，而是直接将搜索词附加到URL
                        searchForm.onsubmit = function(event) {
                            event.preventDefault();
                            const searchTerm = searchInput.value.trim();
                            if (searchTerm) {
                                window.open('https://www.douyin.com/search/' + encodeURIComponent(searchTerm), '_blank');
                            }
                            return false;
                        };
                        break;
                    case 'bilibili':
                        searchForm.action = 'https://search.bilibili.com/all';
                        searchInput.name = 'keyword';
                        searchForm.onsubmit = null; // 清除之前可能的自定义提交事件
                        break;
                    case 'zhihu':
                        searchForm.action = 'https://www.zhihu.com/search';
                        searchInput.name = 'q';
                        searchForm.onsubmit = null; // 清除之前可能的自定义提交事件
                        break;
                }
            });
        });
    }
    
    // 设置动态搜索功能
    function setupDynamicSearch() {
        // 为搜索输入框添加输入事件监听
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            
            // 如果搜索词为空，恢复当前分类的显示
            if (searchTerm === '') {
                // 更新标题
                updateCategoryTitle();
                
                // 如果有子分类，显示子分类
                if (currentCategory !== 'all') {
                    loadSubcategories();
                }
                
                // 加载当前分类的资源
                loadResources();
                return;
            }
            
            // 执行动态搜索
            performDynamicSearch(searchTerm);
        });
    }
    
    // 动态搜索函数（无结果时恢复全部内容，有结果时仅展示匹配资源）
    function performDynamicSearch(searchTerm) {
        // 清空资源容器
        resourcesContainer.innerHTML = '';

        // 搜索资源（按标题、描述、标签）
        const searchResults = websiteData.resources.filter(resource => {
            return (
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        });

        // 没有匹配时，恢复当前分类/子分类的全部资源
        if (searchResults.length === 0) {
            updateCategoryTitle();
            if (currentCategory !== 'all') {
                loadSubcategories();
            } else {
                subcategoriesContainer.style.display = 'none';
            }
            loadResources();
            return;
        }

        // 有匹配时，仅展示匹配资源并隐藏子分类
        currentCategoryTitle.textContent = `搜索结果: "${searchTerm}"`;
        subcategoriesContainer.style.display = 'none';

        const resourceList = document.createElement('div');
        resourceList.classList.add('resources-grid');
        searchResults.forEach(resource => {
            const resourceCard = createResourceCard(resource);
            resourceList.appendChild(resourceCard);
        });
        resourcesContainer.appendChild(resourceList);
    }
    
    // 站内搜索函数 (表单提交时使用，逻辑与动态搜索一致)
    function performLocalSearch(searchTerm) {
        // 清空资源容器
        resourcesContainer.innerHTML = '';

        // 搜索资源
        const searchResults = websiteData.resources.filter(resource => {
            return (
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        });

        // 无匹配则恢复当前分类/子分类的全部资源
        if (searchResults.length === 0) {
            updateCategoryTitle();
            if (currentCategory !== 'all') {
                loadSubcategories();
            } else {
                subcategoriesContainer.style.display = 'none';
            }
            loadResources();
            return;
        }

        // 有匹配则仅展示匹配资源并隐藏子分类
        currentCategoryTitle.textContent = `搜索结果: "${searchTerm}"`;
        subcategoriesContainer.style.display = 'none';

        searchResults.forEach(resource => {
            const resourceCard = createResourceCard(resource);
            resourcesContainer.appendChild(resourceCard);
        });
    }

    // 显示链接选择弹窗
    function showLinkModal(resource) {
        const modal = document.getElementById('linkModal');
        const linkOptions = document.getElementById('linkOptions');
        
        // 清空之前的选项
        linkOptions.innerHTML = '';
        
        // 为每个链接创建选项
        resource.links.forEach(link => {
            const linkOption = document.createElement('a');
            linkOption.href = link.url;
            linkOption.target = '_blank';
            linkOption.classList.add('link-option');
            linkOption.textContent = link.name;
            
            // 点击时关闭弹窗并标记为已访问
            linkOption.addEventListener('click', function() {
                modal.style.display = 'none';
                this.classList.add('visited');
            });
            
            linkOptions.appendChild(linkOption);
        });
        
        // 显示弹窗
        modal.style.display = 'block';
    }

    // 弹窗关闭功能
    const modal = document.getElementById('linkModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // 点击关闭按钮关闭弹窗
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // 点击弹窗外部关闭弹窗
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});