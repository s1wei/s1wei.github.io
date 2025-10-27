/**
 * 搜索引擎切换功能
 * 用于在不同的搜索引擎之间切换搜索
 */

function initializeSearchEngine() {
    // 获取DOM元素
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const engineButtons = document.querySelectorAll('.engine-btn');
    
    // 默认搜索引擎
    let currentEngine = 'bing';
    
    // 设置搜索引擎按钮点击事件
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
                case 'local':
                    // 站内搜索
                    searchForm.action = '#';
                    searchForm.onsubmit = function(event) {
                        event.preventDefault();
                        const searchTerm = searchInput.value.trim().toLowerCase();
                        if (searchTerm) {
                            // 如果有定义站内搜索函数，则调用
                            if (typeof performLocalSearch === 'function') {
                                performLocalSearch(searchTerm);
                            } else {
                                console.error('站内搜索函数未定义');
                            }
                        }
                        return false;
                    };
                    break;
            }
        });
    });
    
    // 初始化默认搜索引擎
    const defaultEngineBtn = document.querySelector('.engine-btn[data-engine="bing"]');
    if (defaultEngineBtn) {
        defaultEngineBtn.click();
    }
}

// 当DOM加载完成后初始化搜索引擎
document.addEventListener('DOMContentLoaded', initializeSearchEngine);