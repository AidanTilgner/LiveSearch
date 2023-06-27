import {
  Configuration,
  OpenAIApi,
  CreateTranscriptionResponse,
  CreateChatCompletionRequest,
} from "openai";
import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const config = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export default openai;

const openaiAxios = axios.create({
  baseURL: "https://api.openai.com/v1/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
});

export const getAudioTranscription = async (audioFile: File) => {
  try {
    const config = {
      file: audioFile,
      model: "whisper-1",
      prompt:
        "a one to one transcription of the audio file presented with no punctuation or capitalization",
      responseFormat: "json",
      temperature: 0.5,
      language: "en",
    };

    const formData = new FormData();
    formData.append("file", config.file);
    formData.append("model", config.model);
    formData.append("prompt", config.prompt);
    formData.append("response_format", config.responseFormat);
    formData.append("temperature", config.temperature.toString());
    formData.append("language", config.language);

    const response = await openaiAxios
      .post("/audio/transcriptions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data as CreateTranscriptionResponse);

    const data = response;

    const text = data.text;

    return {
      message: "Success",
      data: text,
      success: true,
    };
  } catch (error) {
    console.error(
      "There was an error getting the transcription: ",
      (error as any).response.data
    );
    return {
      message: "Something went wrong",
      data: "System: error",
      success: true,
    };
  }
};

export const getChatCompletion = async (
  messages: CreateChatCompletionRequest["messages"],
  model: CreateChatCompletionRequest["model"],
  functions?: CreateChatCompletionRequest["functions"]
) => {
  try {
    const response = await openai.createChatCompletion({
      messages,
      model,
      functions,
    });

    const data = response.data;

    const message = data.choices[0].message;

    return {
      success: false,
      message: "Success",
      data: message,
    };
  } catch (error) {
    console.error(
      "There was an error getting the chat completion: ",
      (error as any).response.data
    );
    return {
      message: "Something went wrong",
      data: undefined,
    };
  }
};
