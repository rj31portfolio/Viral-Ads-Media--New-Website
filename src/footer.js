(() => {
  const placeholder = document.getElementById("footer-placeholder");
  if (!placeholder) {
    return;
  }

  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
    document.head.appendChild(fontAwesome);
  }

  fetch(new URL("footer.html", document.baseURI))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Footer request failed: ${response.status}`);
      }
      return response.text();
    })
    .then((markup) => {
      placeholder.outerHTML = markup;
    })
    .catch((error) => {
      console.error("Failed to load footer:", error);
    });
})();