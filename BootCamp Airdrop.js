document
  .getElementById("Bootcamp-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const address = document.getElementById("walletAddress").value;
    const loading = document.getElementById("loading");
    const result = document.getElementById("result");

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      result.textContent = "Invalid EVM address.";
      return;
    }
    loading.classList.remove("hidden");
    result.innerText = "";

    try {
      const response = await fetch(
        `http://localhost:3000/check-eligibility?address=${address}`
      );
      const data = await response.json();
      console.log("Backend response:", data);

      if (data.eligible) {
        result.innerText = `🤑 Congatulations, you're eligible for the airdrop.\nSent: ${data.sentCount} | Received: ${data.receivedCount} | Total: ${data.totalCount}`;
      } else {
        result.innerText = `🤷😢You're not eligible.\nSent: ${data.sentCount} | Received: ${data.receivedCount} | Total: ${data.totalCount}`;
      }
    } catch (err) {
      result.innerText = `⚠️ Error: ${err.message}`;
    } finally {
      loading.classList.add("hidden");
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const lightBtn = document.getElementById("light-mode-btn");
  const darkBtn = document.getElementById("dark-mode-btn");

  const setTheme = (theme) => {
    document.body.classList.toggle("dark-mode", theme === "dark");
    localStorage.setItem("theme", theme);
  };

  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  // Event listeners
  lightBtn.addEventListener("click", () => setTheme("dark"));
  darkBtn.addEventListener("click", () => setTheme("light"));
});
