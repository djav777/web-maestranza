import { API_MAESTRANZA } from "@/variablesglobales";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const codigo = req.nextUrl.searchParams.get("codigo");
  try {
    const response = await axios.get(API_MAESTRANZA + `/Empresas/${codigo}`, {
      headers: {
        "Content-Type": req.headers.get("Content-Type") as string,
        Authorization: req.headers.get("Authorization") as string,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json("Error");
  }
}
