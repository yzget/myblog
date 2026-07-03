# Hugo+主题 头像设置参考

*2026-07-02*

> 主题所带头像可能放置的位置和更改自己头像的一些方法

笔记
## 📘Hugo 头像与 Favicon 完整配置（hugo-primer-blog）
### 🧭 一、整体结构先理解（非常重要）

在 Hugo 里，“头像/图标”通常分三类：

类型 作用 本质
favicon 浏览器标签页图标 网站级静态资源
article avatar 文章/作者头像 主题 partial 渲染
sidebar avatar 侧边栏 aboutme 头像 partial 模块
### 🟡 二、标签页头像（Favicon）
#### 📍 1. 真实生效代码位置

你的主题代码是：
````
<link rel="icon" href="{{ .Site.Params.faviconIco | default "favicon.ico" | relURL }}" type="image/x-icon"> 
````
#### 2. 读取优先级（非常关键） 
✅ 优先级顺序： hugo.toml 里的配置 /static/favicon.ico（默认兜底） 
#### 📂 3. 可能存在的文件路径 
✔ 推荐标准路径： static/favicon.ico static/favicon.png static/apple-touch-icon.png 
#### ⚙️ 4. 正确配置方式（推荐） 
👉 hugo.toml [params] faviconIco = "/favicon.ico" faviconPng = "/favicon.png" 
#### 🧨 5. 对应 theme 代码位置
一般在：
````
themes/hugo-primer-blog/layouts/partials/head.html或：layouts/partials/head.html (如果你 override 了主题)
````
#### 🧩 6. 完整 head favicon 推荐写法（标准版）
````
{{ with .Site.Params.faviconPng }}
<link rel="shortcut icon" href="{{ . | relURL }}">
{{ end }}

<link rel="icon" href="{{ .Site.Params.faviconIco | default "favicon.ico" | relURL }}" type="image/x-icon">

<link rel="apple-touch-icon" href="/apple-touch-icon.png">
````
#### 🚨 7. favicon 常见坑 ❌ 改了没效果
原因：
浏览器缓存（最常见）没强刷（Ctrl + F5）  
favicon.ico 没更新成功  
❌ PNG 不生效  
原因：theme 没用 faviconPng或 head.html 没引用
### 🟢 三、文章/作者头像（Article Avatar）
#### 📍 1. 头像通常来源（3种可能）
✔ ① aboutme 模块（你当前项目在用）
````
themes/hugo-primer-blog/layouts/partials/sidebar/aboutme.html
````
#### 📍 2. 你的配置已经启用：
````
[[params.sidebarModules]]
partial = "aboutme"
````
👉 所以头像一定在 aboutme.html
#### 📂 3. aboutme 可能的写法
情况 A：写死图片👉 改这里就直接换头像  
情况 B：读取配置（推荐）👉 对应 hugo.toml
````
[params]
avatar = "/images/avatar.png"
````
#### 📂 4. 推荐头像路径
````
static/images/avatar.png
````
#### 🚨 5. aboutme 头像坑
❌ 图片写死在 theme → 更新麻烦  
❌ 路径错（/images vs images）  
❌ 没用 relURL 导致子目录失效
### 🟣 四、文章页头像（Author Avatar）
#### 📍 1. 可能存在位置
通常在：
````
themes/hugo-primer-blog/layouts/_default/single.html
````
或：
````
themes/hugo-primer-blog/layouts/partials/post/author.html
````
````
themes/hugo-primer-blog/layouts/partials/author.html
````
#### 📍 2. 常见代码形式
写死版：
参数版（推荐）：
#### 📍 3. 推荐统一配置（强烈建议）
````
[params]
avatar = "/images/avatar.png"
````
👉 让：
````
aboutme
article author
sidebar
````
全部共用一个头像源
### 🟠 五、标签页/分类页“头像”问题说明
很多人误会：❌ tag page 有头像  
其实：✔ 标签页一般没有头像
只有：
````
title
icon（favicon）
banner（少数主题）
````
📍 如果你看到“标签页头像”，通常来自：
① 分类页 icon（主题自定义）
可能在：
````
layouts/_default/terms.html
````
````
layouts/_default/taxonomy.html
````
② 标签页 header 图标可能写死：  
📍 但本质：👉 不是 Hugo 标准功能，是 theme 自定义
### 🔥 六、完整推荐项目结构（最佳实践）
````
static/
├── favicon.ico
├── favicon.png
├── apple-touch-icon.png
└── images/
└── avatar.png
````
### ⚙️ 七、推荐 hugo.toml 统一配置
````
[params]
头像（文章 + aboutme）
avatar = "/images/avatar.png"
favicon
faviconIco = "/favicon.ico"
faviconPng = "/favicon.png"
````
### 🚨 八、必须注意的坑（重点）
#### ❌ 1. favicon 改了不生效
👉 清缓存：
Ctrl + F5
或 
````
Chrome DevTools → Disable cache
````
#### ❌ 2. static 路径错误
✔ 正确：
````
/favicon.ico
/images/avatar.png
````
❌ 错误：
````
static/favicon.ico（写法错误）
````
#### ❌ 3. theme 覆盖你的配置
如果 theme 写死：
👉 config 是无效的
#### ❌ 4. Hugo 子路径问题
必须用：
relURL
否则部署到：
/blog/
会 404
#### 🧾 九、最终一句话总结
👉 favicon 属于：static/ + head.html 控制  
👉 头像（文章/侧边栏）属于：aboutme.html + single.html + params.avatar

