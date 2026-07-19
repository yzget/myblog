---
title: "为 Hugo Primer Blog 主题添加现代化智能自适应弹窗搜索功能"
date: 2026-07-03T12:30:08+08:00
draft: false
author: "M.Liu"
description: "为主题添加现代化智能自适应弹窗搜索功能"
image: "/images/sousuo.jpg"
tags: ["hugo"]
categories: ["网络收藏"]
archives: ["hugo"]
---
```
本教程将介绍如何不修改主题源码，通过在 Hugo 站点根目录进行扩展，为 `Hugo Primer Blog` 主题添加一个**现代化的、圆角设计的、且能自动适应白天/夜间模式**的本地实时搜索弹窗（基于 Fuse.js）。

---

## 🛠️ 核心原理与文件目录结构

本方案采用 **Hugo 模板覆写机制（Lookup Order）**，所有新建或修改的文件均位于你的**网站根目录**下，绝不破坏 `themes/` 里的主题源码，后续主题升级不受影响。

你需要准备或修改的文件目录结构如下：
```text
您的站点根目录/
├── content/
├── hugo.toml (或 config.toml)
└── layouts/
    ├── _default/
    │   └── index.json        <-- 1. 负责生成搜索数据索引
    └── partials/
        ├── header.html       <-- 2. 覆写导航栏，挂载搜索按钮与组件
        └── search-modal.html <-- 3. 弹窗的 HTML 结构、美化样式与搜索逻辑
```
详细实现步骤
第一步：配置 hugo.toml 生成 JSON 索引
我们需要让 Hugo 在打包网站时，自动将所有文章的标题、摘要和内容生成一个 index.json 文件，供前端检索。

打开网站根目录的 hugo.toml，在文件最顶部的全局配置区（不要放在 [[menu.main]] 等双括号配置下方），添加以下输出和媒体类型配置：

Ini, TOML
```
# 1. 声明首页输出格式，必须包含 "JSON"
[outputs]
  home = ["HTML", "RSS", "LLMS", "JSON"]
  page = ["HTML", "Markdown"]
  section = ["HTML", "RSS"]
  taxonomy = ["HTML"]
  term = ["HTML", "RSS"]

# 2. 核心补丁：声明 JSON 媒体类型
[mediaTypes]
  [mediaTypes."application/json"]
    suffixes = ["json"]

# 3. 核心补丁：告诉 Hugo 这是纯文本模板，需要解析里面的 {{ ... }} 语法
[outputFormats]
  [outputFormats.JSON]
    mediaType = "application/json"
    baseName = "index"       
    isPlainText = true    
````  
第二步：创建 JSON 数据模板文件
在网站根目录下，新建文件 layouts/_default/index.json，并填入以下 Hugo 模板代码。它负责将你的文章数据规范化打包：

JSON
```
[
  {{- range $index, $page := .Site.RegularPages }}
  {{- if $index }},{{ end }}
  {
    "title": {{ $page.Title | jsonify }},
    "permalink": {{ $page.Permalink | jsonify }},
    "summary": {{ $page.Summary | plainify | jsonify }},
    "content": {{ $page.Content | plainify | jsonify }}
  }
  {{- end }}
]
```
验证方法： 配置完成后，重启 hugo server，在浏览器访问 http://localhost:1313/index.json。如果出来的不是上面这段源码，而是密密麻麻的真实文章数据，说明数据源配置成功。

第三步：创建智能自适应搜索弹窗组件
在网站根目录下，新建文件 layouts/partials/search-modal.html。

此文件包含现代化的大圆角设计 (16px)、胶囊输入框 (24px) 以及智能吸色 JavaScript 逻辑（在打开弹窗时，实时抓取网页 body 的真实背景色和文字颜色应用到弹窗上，100% 完美自适应白天/夜间模式）：

HTML
```
<div id="search-modal" class="search-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: flex-start; padding-top: 12vh; backdrop-filter: blur(2px);">
    
    <div id="modal-content" class="search-modal-content" style="width: 90%; max-width: 600px; border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.2); position: relative; max-height: 70vh; display: flex; flex-direction: column; border: 1px solid rgba(128,128,128,0.2);">
        
        <button id="close-search" style="position: absolute; top: 1.2rem; right: 1.2rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; line-height: 1; color: inherit; opacity: 0.7;">&times;</button>
        
        <h3 style="margin-top: 0; margin-bottom: 1.2rem; font-size: 1.25rem; font-weight: 600; color: inherit;">搜索文章</h3>
        
        <input type="text" id="modal-search-input" placeholder="输入关键词实时搜索..." style="width: 100%; padding: 0.75rem 1.2rem; font-size: 1rem; border: 1px solid rgba(128,128,128,0.3); border-radius: 24px; outline: none; transition: all 0.2s ease;">
        
        <div id="modal-search-results" style="margin-top: 1.2rem; overflow-y: auto; flex: 1; padding-right: 5px;"></div>
    </div>
</div>

<script src="[https://cdn.jsdelivr.net/npm/fuse.js@6.6.2](https://cdn.jsdelivr.net/npm/fuse.js@6.6.2)"></script>

<script>
document.addEventListener("DOMContentLoaded", function() {
    let fuse;
    const searchModal = document.getElementById('search-modal');
    const modalContent = document.getElementById('modal-content');
    const searchInput = document.getElementById('modal-search-input');
    const searchResults = document.getElementById('modal-search-results');
    const closeSearch = document.getElementById('close-search');

    // 输入框聚焦时的发光效果
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#0366d6';
        searchInput.style.boxShadow = '0 0 0 3px rgba(3,102,214,0.25)';
    });
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = 'rgba(128,128,128,0.3)';
        searchInput.style.boxShadow = 'none';
    });

    // 异步获取索引文件
    fetch('{{ "index.json" | absURL }}')
        .then(response => response.json())
        .then(data => {
            fuse = new Fuse(data, {
                keys: ['title', 'summary', 'content'],
                threshold: 0.4
            });
        });

    // 监听输入，实时检索
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }
        if(!fuse) return;
        const results = fuse.search(query);
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p style="font-size:0.9rem; padding: 0 0.5rem; opacity: 0.7;">没有找到相关文章</p>';
            return;
        }
        
        let html = '';
        results.forEach(result => {
            const item = result.item;
            html += `
                <div class="search-item" style="margin-bottom: 0.8rem; border-bottom: 1px solid rgba(128,128,128,0.1); padding: 0.6rem 0.8rem; border-radius: 8px; transition: background 0.2s;">
                    <h4 style="margin: 0 0 0.3rem 0; font-size: 1.05rem;"><a href="${item.permalink}" style="color: #0366d6; text-decoration: none; font-weight: 600;">${item.title}</a></h4>
                    <p style="font-size: 0.88rem; margin: 0; line-height: 1.5; opacity: 0.8;">${item.summary}</p>
                </div>
            `;
        });
        searchResults.innerHTML = html;
    });

    // 💡 智能吸色核心：打开弹窗时，实时“捕获”网页当前的背景色和文字颜色并应用
    window.openSearchModal = function(e) {
        if(e) e.preventDefault();
        
        const bodyStyles = window.getComputedStyle(document.body);
        const currentBg = bodyStyles.backgroundColor;
        const currentTextColor = bodyStyles.color;

        // 动态赋色
        modalContent.style.backgroundColor = currentBg;
        modalContent.style.color = currentTextColor;
        searchInput.style.backgroundColor = currentBg === 'rgba(0, 0, 0, 0)' || currentBg === 'transparent' ? '#fff' : currentBg;
        searchInput.style.color = currentTextColor;

        searchModal.style.display = 'flex';
        searchInput.focus(); 
    }

    window.closeSearchModal = function() {
        searchModal.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
    }

    closeSearch.addEventListener('click', closeSearchModal);
    searchModal.addEventListener('click', (e) => { if (e.target === searchModal) closeSearchModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearchModal(); });
});
</script>
```
第四步：覆写 header.html 导航栏挂载按钮
我们需要将主题默认的导航栏复制到根目录下进行改造。

将 themes/hugo-primer-blog/layouts/partials/header.html 复制到网站根目录的 layouts/partials/header.html。

打开该文件，将内容完整替换为以下代码（其中包含带有 onclick="openSearchModal(event)" 触发事件的专属按钮，并在文件最底部成功注入了刚才写的弹窗组件）：

HTML
```
<header class="AppHeader">
  <div class="AppHeader-globalBar">
    <div class="AppHeader-globalBar-start">
      <a href="{{ .Site.Home.RelPermalink }}" class="AppHeader-logo" aria-label="{{ .Site.Title }}">
        {{- with .Site.Params.logo -}}
        <img src="{{ . | relURL }}" alt="{{ $.Site.Title }}" height="32">
        {{- else -}}
        <span class="AppHeader-logo-text">{{ .Site.Title }}</span>
        {{- end -}}
      </a>

      <nav class="AppHeader-nav" aria-label="{{ i18n "mainNavigation" | default "Main navigation" }}">
        {{- range .Site.Menus.main -}}
        <a href="{{ .URL | relLangURL }}" class="AppHeader-nav-item{{ if $.IsMenuCurrent "main" . }} AppHeader-nav-item--current{{ end }}">
          {{- .Name -}}
        </a>
        {{- end -}}

        <a href="#" onclick="openSearchModal(event)" class="AppHeader-nav-item" aria-label="Search" style="display: inline-flex; align-items: center; cursor: pointer;">
          <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>搜索</span>
        </a>
      </nav>
    </div>

    <div class="AppHeader-globalBar-end">
      {{- partial "theme-toggle.html" . -}}

      {{- if hugo.IsMultilingual -}}
      <details class="dropdown details-reset details-overlay AppHeader-dropdown">
        <summary class="AppHeader-button" aria-haspopup="true" aria-label="{{ i18n "selectLanguage" | default "Select language" }}">
          <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.78 8.75a9.64 9.64 0 0 0 1.363 4.177c.255.426.542.832.857 1.215.245-.296.551-.705.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a9.927 9.927 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.507 6.507 0 0 0 4.666 5.5c-.123-.181-.24-.365-.352-.552-.715-1.192-1.437-2.874-1.581-4.948Zm-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.507 6.507 0 0 0-4.666 5.5Zm10.181 1.5c-.144 2.074-.866 3.756-1.581 4.948-.111.187-.229.371-.352.552a6.507 6.507 0 0 0 4.666-5.5Zm2.733-1.5a6.507 6.507 0 0 0-4.666-5.5c.123.181.241.365.352.552.715 1.192 1.437 2.874 1.581 4.948Z"></path>
          </svg>
          <span class="AppHeader-button-text">{{ .Site.Language.LanguageName }}</span>
          <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 16 16" width="12" height="12" fill="currentColor" class="AppHeader-dropdown-caret">
            <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"></path>
          </svg>
        </summary>
        <ul class="dropdown-menu dropdown-menu-sw">
          {{- range $.Site.Languages -}}
          {{- $lang := . -}}
          {{- $targetUrl := (printf "/%s/" .Lang) -}}
          {{- range $.Page.Translations -}}
            {{- if eq .Language.Lang $lang.Lang -}}
              {{- $targetUrl = .RelPermalink -}}
            {{- end -}}
          {{- end -}}
          {{- if eq $.Site.Language.Lang $lang.Lang -}}
            {{- $targetUrl = $.RelPermalink -}}
          {{- end -}}
          <li>
            <a href="{{ $targetUrl }}">{{ $lang.LanguageName }}</a>
          </li>
          {{- end -}}
        </ul>
      </details>
      {{- end -}}
    </div>
  </div>
</header>

{{ partial "search-modal.html" . }}
```
🏁 部署与日常使用说明
重启服务：由于修改了 hugo.toml 配置文件，请在终端按 Ctrl + C 关闭服务，并重新运行 hugo server。

多语言与菜单隔离：因为我们已经在 header.html 模板中硬编码写入了独立的、带有点击事件的按钮，请确保 hugo.toml 的 [[menu.main]] 或其他多语言菜单中不含有跳转到 /search/ 的多余配置，保持导航栏清爽。

自动化同步：后续撰写、修改或删除任何 Markdown 文章时，无需手动维护搜索。Hugo 在打包时会自动更新数据文件，弹窗搜索结果会全自动实时同步！  