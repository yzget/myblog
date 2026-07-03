function copyCode(btn) {
  const code = btn.nextElementSibling.innerText;

  navigator.clipboard.writeText(code).then(() => {
    btn.innerText = "Copied!";
    setTimeout(() => (btn.innerText = "Copy"), 1500);
  });
}