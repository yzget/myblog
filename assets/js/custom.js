document.addEventListener('DOMContentLoaded', () => {
  // 完美匹配 Hugo 生成的 .highlight 容器
  document.querySelectorAll('.highlight').forEach((container) => {
    const pre = container.querySelector('pre');
    if (!pre) return;

    // 创建复制按钮
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.type = 'button';
    button.innerHTML = '复制';

    // 将按钮插入到容器中
    container.appendChild(button);

    // 点击事件实现复制
    button.addEventListener('click', () => {
      // 提取 pre 内部 code 标签的纯文本
      const codeBlock = pre.querySelector('code');
      const codeText = codeBlock ? codeBlock.innerText : pre.innerText;

      navigator.clipboard.writeText(codeText).then(() => {
        button.innerHTML = '已复制!';
        setTimeout(() => {
          button.innerHTML = '复制';
        }, 2000);
      }).catch((err) => {
        console.error('复制失败: ', err);
      });
    });
  });
});
