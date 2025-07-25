const express = require('express')
const router = express.Router();
const Together = require('together-ai');
const OpenAi = require('openai')
const { userAuth } = require('../middlewares/auth');
require('dotenv').config();


// backend: routes/airoutes.js
router.post('/ai', userAuth, async (req, res) => {
  try {

    const { prompt } = req.body;
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY
    })

    const response = await together.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      temperature: 0.7,
      max_tokens: 150,
      top_p: 0.9,
    });

    return res.status(200).json({
      success: true,
      response: response.choices[0].message.content
    });

  } catch (error) {
    console.error("Error:", error.message || error);
  }


});

router.post('/ai/generate/interview', userAuth, async (req, res) => {
  try {
    const { type, level, duration, position, techStack } = req.body;
 
    const prompt = `prepare questions for a job interview.
    the job role is ${position}.
    the job expierence level is ${level}.
    the tech stack used in the job is ${techStack}.
    the focus between behaviourial and technical questions should lean towards ${type}.
    the amount of questions to be generated for lasting in the time period ${duration} minutes.
    return only the questions without any additional text.
    the questions are going to read by voice assistant so do not use "/" or "*" or "\n" or any other special characters that might break the voice assistant in the generated questions.
    return the questions formatted like this
    ["question 1", "question 2", "question 3"]
    Format your response strictly as valid JSON, without any explanation or markdown formatting.
    Thank you`

    const openai = new OpenAi({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY
    })

    const response = await openai.chat.completions.create({
      model: 'qwen/qwen3-coder:free',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const questionsRaw = response.choices[0].message?.content.trim();

    if (questionsRaw.startsWith("```")) {
    questionsRaw = questionsRaw.replace(/```json|```/g, "").trim();
    }

    let parsedQuestions = JSON.parse(questionsRaw);

    const formattedInterview = {
      position,level,type,
      questions : parsedQuestions
    }

    return res.status(200).json({success:true,data:formattedInterview})

  } catch (error) {
    console.log(error)
    console.error("❌ JSON parse error:", error.message);
    return res.status(500).json({
    success: false,
    message: "AI returned invalid JSON. Please regenerate.",
  });
  }

})


module.exports = router;