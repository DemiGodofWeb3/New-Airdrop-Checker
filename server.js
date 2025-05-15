const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;
const ETHERSCAN_API_KEY = "M0GFnI5xz_6QFdnSyTmVLbYOhQmhgE5j";

app.use(cors());

app.get("/check-eligibility", async (req, res) => {
  const address = req.query.address;
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: "Invalid address" });
  }

  try {
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    const response = await axios.get(url);

    if (response.data.status !== "1") {
      return res.status(404).json({ error: "No transactions found" });
    }

    const txCount = response.data.result.length;
    res.json({ txCount, eligible: txCount >= 500 });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
