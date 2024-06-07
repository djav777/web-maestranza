import { API_MAESTRANZA } from "@/variablesglobales";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const response = await axios.get(
            API_MAESTRANZA + `/Locales/`, {
            params: {},
            headers: {
                "Content-Type": req.headers.get('Content-Type') as string,
                "Authorization": req.headers.get('Authorization') as string
            }
        }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json(error);
    }
}

export async function POST(req: NextRequest) {
    const { data } = await req.json();

    try {
        const response = await axios.post(API_MAESTRANZA + "/Locales/", data,
            {
                headers: {
                    "Content-Type": req.headers.get('Content-Type') as string,
                    "Authorization": req.headers.get('Authorization') as string
                }
            });
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json('Error');
    }
}

export async function PUT(req: NextRequest) {
    const { data } = await req.json();

    try {
        const response = await axios.put(API_MAESTRANZA + "/Locales/", data,
            {
                headers: {
                    "Content-Type": req.headers.get('Content-Type') as string,
                    "Authorization": req.headers.get('Authorization') as string
                }
            });
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json('Error');
    }
}


export async function DELETE(req: NextRequest) {
    const codigo = req.nextUrl.searchParams.get('referencia')
    try {
        const response = await axios.delete(
            API_MAESTRANZA + `/Locales/${codigo}`, {
            headers: {
                "Content-Type": req.headers.get('Content-Type') as string,
                "Authorization": req.headers.get('Authorization') as string
            }
        }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json("Error");
    }
}