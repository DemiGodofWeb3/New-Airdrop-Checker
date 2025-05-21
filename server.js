require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Alchemy, Network } = require("alchemy-sdk");

const app = express();
app.use(cors());

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(config);

app.get("/check-eligibility", async (req, res) => {
  const address = req.query.address.toLowerCase();

  try {
    const [sentTxns, receivedTxns] = await Promise.all([
      alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: address,
        category: ["external"],
      }),
      alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: "latest",
        toAddress: address,
        category: ["external"],
      }),
    ]);

    const sentCount = sentTxns.transfers.length;
    const receivedCount = receivedTxns.transfers.length;
    const totalCount = sentCount + receivedCount;

    const response = {
      eligible: totalCount >= 200,
      sentCount,
      receivedCount,
      totalCount,
    };

    res.json(response);
  } catch (err) {
    console.error("Error checking transactions:", err);
    res.status(500).json({ error: "Error checking eligibility" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
