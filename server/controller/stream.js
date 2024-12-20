import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY || "3ua7rmk2epdb";
const apiSecret =
  process.env.STREAM_SECRET_KEY ||
  "m2wkrug656zr977jy8ta445fjn5t4k76t39d2d4wf892auqy7deyybrfh6ms84aw";

const client = new StreamClient(apiKey, apiSecret);

export const tokenProvider = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const token = client.generateUserToken({
      user_id: userId,
      validity_in_seconds: 3600, // 1hr
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "something went wrong!" });
  }
};
