import LZString from "lz-string";
import { NextResponse } from "next/server";
import { buildConfig } from "@/components/ConfigDisplay";
import { buildVolume, VolumeDisplayProps } from "@/components/VolumeDisplay";

export const dynamic = "force-dynamic";

type RouteParams = {
    params: Promise<{ data: string }>;
};

function volumeToBash({ volTitle, volName, volPath }: VolumeDisplayProps) {
    const vol = buildVolume({ volTitle, volName, volPath });
    return `
mkdir -p /etc/containers/systemd/
cat << 'EOF' | tee /etc/containers/systemd/${volName}.volume > /dev/null
${vol}
EOF
`;
}

async function handler(request: Request, { params }: RouteParams) {
    const { data } = await params;

    const decoded = LZString.decompressFromEncodedURIComponent(data);
    const payload = JSON.parse(decoded);
    const appName = payload.name;

    const config = buildConfig({
        appDescription: payload.description,
        appImage: payload.image,
        appPort: payload.port,
        appName: payload.name,
        appDomain: payload.domain,
        appVolumes: payload.volumes,
    });


    const out = `
mkdir -p /etc/containers/systemd/
cat << 'EOF' | tee /etc/containers/systemd/${appName}.container > /dev/null
${config}
EOF
${payload.volumes.map(volumeToBash).join("\n")}
`;

    return new NextResponse(out);
}

export { handler as GET, handler as POST };
