export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST allowed" });
    }
  
    const { name, email, message } = req.body;
  
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing fields" });
    }
  
    // TEMP: just to confirm backend works
    console.log("Message received:", name, email, message);
  
    return res.status(200).json({
      success: true,
      message: "Message received successfully"
    });
  }
  