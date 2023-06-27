import { NextResponse } from "next/server";
import { getAudioTranscription } from "@/library/utils/openai";

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const audioFile = body.get("audio");

    if (!audioFile)
      return NextResponse.json({
        message: "No audio file provided",
        error: "No audio file provided",
      });

    const response = await getAudioTranscription(audioFile as File);

    if (!response.success)
      return NextResponse.json({
        message: response.message,
        data: response.data,
      });

    return NextResponse.json({
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Something went wrong",
      error: error,
    });
  }
}
