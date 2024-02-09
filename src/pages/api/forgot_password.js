export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { email } = req.body;
            console.log(email);

            res.status(200).json({
                message: "POST request received and processed successfully",
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
