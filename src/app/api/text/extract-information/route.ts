import { NextResponse } from "next/server";
import { getFormattedInformationExtracted } from "@/library/utils/information";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const transcript = body.transcript;
    const mode = body.mode;

    const response = await getFormattedInformationExtracted(transcript, mode);

    return NextResponse.json({
      message: "Success",
      data: response,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Something went wrong",
      error: error,
    });
  }
}
