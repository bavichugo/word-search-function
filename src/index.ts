import { onRequest } from "firebase-functions/v2/https";
import { filterWords } from "./helper/wordsHelper";
import express from "express";
import cors from "cors";

interface QueryParameters {
  letters?: string;
  absentLetters?: string;
  startsWith?: string;
  endsWith?: string;
  pattern?: string;
  size?: number;
  lastWord?: string;
  language?: string;
}

const corsOptions = {
  origin: 'https://xwordsearch.netlify.app',
  optionsSuccessStatus: 200,
}

const app = express();
app.use(cors(corsOptions));

app.get("/words", async (req, res) => {
  const query: QueryParameters = req.query as QueryParameters;

  const {
    letters,
    absentLetters,
    startsWith,
    endsWith,
    pattern,
    size,
    lastWord,
    language,
  } = query;

  const filter = {
    letters,
    absentLetters,
    startsWith,
    endsWith,
    pattern,
    size,
  };

  try {
    const filteredWords = await filterWords(language, filter, lastWord);
    res.status(200).json(filteredWords);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

export const api = onRequest(app);
