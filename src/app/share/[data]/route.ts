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
echo ">>> mkdir -p /etc/containers/systemd/"
mkdir -p /etc/containers/systemd/
echo ">>> cat << 'EOF' | tee /etc/containers/systemd/${appName}.container > /dev/null
${config}
EOF
${payload.volumes.map(volumeToBash).join("\n")}"
cat << 'EOF' | tee /etc/containers/systemd/${appName}.container > /dev/null
${config}
EOF
${payload.volumes.map(volumeToBash).join("\n")}

read -p "Reload systemd daemon? (y/N): " resp
if [[ "$resp" =~ ^[Yy](es)?$ ]]; then
    echo ">>> systemctl daemon-reload"
    systemctl daemon-reload
    
    read -p "Start service? (y/N): " resp2
    if [[ "$resp2" =~ ^[Yy](es)?$ ]]; then
        echo ">>> systemctl start ${appName}"
        systemctl start ${appName}
    else
        echo "Cancelled start service."
    fi
else
    echo "Cancelled daemon reload."
fi

`;

    return new NextResponse(out);
}

export { handler as GET, handler as POST };
