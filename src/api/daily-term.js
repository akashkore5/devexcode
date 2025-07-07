import dailyTerms from "../../data/daily_terms.json";

export default function handler(req, res) {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split("T")[0];
    const term = dailyTerms.find((t) => t.date === targetDate);
    if (!term) {
      return res.status(404).json({ message: `No daily term found for ${targetDate}` });
    }
    res.status(200).json(term);
  } catch (error) {
    console.error("Daily term API error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}