document.addEventListener('DOMContentLoaded', () => {
  // Hugo 渲染的代码块通常包裹在 .highlight 或 pre code 中
  const codeBlocks = document.querySelectorAll('.highlight, pre');

  codeBlocks.forEach((codeBlock) => {
    // 确保不重复添加
    if (codeBlock.querySelector('.copy-code-btn')) return;

    // 创建复制按钮
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.type = 'button';
    button.innerText = '复制';

    // 将按钮插入到代码块中
    codeBlock.style.position = 'relative';
    codeBlock.appendChild(button);

    // 绑定点击事件
    button.addEventListener('click', () => {
      const code = codeBlock.querySelector('code') ? codeBlock.querySelector('code').innerText : codeBlock.innerText;
      
      navigator.clipboard.writeText(code).then(() => {
        button.innerText = '已复制！';
        setTimeout(() => { button.innerText = '复制'; }, 2000);
      }).catch(err => {
        console.error('复制失败: ', err);
      });
    });
  });
});