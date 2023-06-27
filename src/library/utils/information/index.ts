import { InformationExtractionModes } from "@/declarations/main";
import { getNotesFromTranscription } from "./notes";

export const modeToPrompts: {
  [key: string]: {
    system: () => string;
    user: (...args: any[]) => string;
  };
} = {
  notes: {
    system: () => {
      return `
        You are a note taker.
        Given a transcription, block of text, dialogue, or some other form of text, you will extract the most important information from it.
        You will then organize the information into a note, which properly summarizes the key points.
        The notes should be organized without direct reference to the speaker, but should only contain the information.
        The title should express the main idea of the content.
            `;
    },
    user: (text: string) => {
      return `
        Here is some text for you to make into notes:

        "${text}"
        `;
    },
  },
};

export const getFormattedInformationExtracted = async (
  text: string,
  mode: InformationExtractionModes
) => {
  try {
    switch (mode) {
      case "notes":
        return getNotesFromTranscription(text);
      default:
        return "Invalid mode";
    }
  } catch (error) {
    console.error(error);
    return {
      data: {
        message: "Something went wrong",
        error: error,
      },
    };
  }
};
