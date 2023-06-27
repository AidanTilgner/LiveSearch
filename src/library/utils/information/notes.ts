import { Note } from "@/declarations/main";
import { modeToPrompts } from "./index";
import { getChatCompletion } from "../openai";

export const getNotesFromTranscription = async (transcription: string) => {
  try {
    const systemPrompt = modeToPrompts["notes"].system();
    const userPrompt = modeToPrompts["notes"].user(transcription);

    const response = await getChatCompletion(
      [
        {
          content: systemPrompt,
          role: "system",
        },
        {
          content: userPrompt,
          role: "user",
        },
      ],
      "gpt-3.5-turbo-0613",
      [
        {
          name: "contruct_notes",
          description: "Creates a notes object given an input of various notes",
          parameters: {
            type: "object",
            properties: {
              notes: {
                type: "array",
                items: {
                  $ref: "#/definitions/Note",
                },
              },
            },
            required: ["notes"],
            definitions: {
              Note: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                  },
                  content: {
                    type: "string",
                  },
                },
                required: ["title", "content"],
              },
            },
          },
        },
      ]
    );

    const functionResponse = response.data?.function_call;

    if (!functionResponse || !functionResponse.name)
      throw new Error("No function response");

    const functionToCall =
      functionMapper[functionResponse.name as keyof typeof functionMapper];

    if (!functionToCall) throw new Error("No function to call");

    const data = functionToCall(
      JSON.parse(functionResponse.arguments as string)
    );

    return data;
  } catch (error) {
    console.error(error);
    return {
      data: null,
    };
  }
};

export const constructNotes = ({ notes }: { notes: Note[] }) => {
  return notes;
};

const functionMapper = {
  contruct_notes: constructNotes,
};
