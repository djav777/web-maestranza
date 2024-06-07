import { API_MAESTRANZA } from "@/variablesglobales";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const response = await axios.get(
            API_MAESTRANZA + `/Permisos`, {
            params: {},
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

export async function PUT(req: NextRequest) {
    const { menu, opcion, acceso1, acceso2, acceso3, acceso4, acceso5 } = await req.json();

    try {
        const response = await axios.put(
            API_MAESTRANZA + `/Permisos`, {
            menu: menu,
            opcion: opcion,
            acceso1: acceso1,
            acceso2: acceso2,
            acceso3: acceso3,
            acceso4: acceso4,
            acceso5: acceso5,
        }, {
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