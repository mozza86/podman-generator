import LZString from "lz-string";
import { NextResponse } from "next/server";

type VolumeItem = {
    volTitle: string;
    volName: string;
    volPath: string;
};

type SharePayload = {
    appTitle?: string;
    appName?: string;
    appImage?: string;
    appDescription?: string;
    appDomain?: string;
    appPort?: number;
    appVolumes?: VolumeItem[];
};

type NormalizedPayload = Required<
    Pick<
        SharePayload,
        "appTitle" | "appName" | "appImage" | "appDescription" | "appDomain" | "appPort"
    >
> & {
    appVolumes: VolumeItem[];
};

function sanitizeName(value: string, fallback: string) {
    return (
        value
            .toLowerCase()
            .replace(/[^a-z0-9._-]+/g, "-")
            .replace(/^-+|-+$/g, "") || fallback
    );
}

function handler() {

}

export { handler as GET };