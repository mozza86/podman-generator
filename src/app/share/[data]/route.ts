import LZString from "lz-string";
import { NextResponse } from "next/server";
import {buildConfig, VolumeSpec} from "@/components/ConfigDisplay";
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

    const out = `#!/bin/bash

# name: ${payload.name}
# description: ${payload.description}
# image: ${payload.image}
# port: ${payload.port}
# domain: ${payload.domain}
# volumes: ${payload.volumes.map((v: VolumeSpec) => v.volName).join(", ")}

SKIP_PROMPT=false

if [[ "$1" == "-y" ]]; then
    SKIP_PROMPT=true
fi

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


if [ "$SKIP_PROMPT" = true ]; then
    resp="y"
else
    read -p "Reload systemd daemon? (y/N): " resp < /dev/tty
fi

if [[ "$resp" =~ ^[Yy](es)?$ ]]; then
    echo ">>> systemctl daemon-reload"
    systemctl daemon-reload
    if [ "$SKIP_PROMPT" = true ]; then
        resp="y"
    else
        read -p "Start service? (y/N): " resp2 < /dev/tty
        if [[ "$resp2" =~ ^[Yy](es)?$ ]]; then
            echo ">>> systemctl start ${appName}"
            systemctl start ${appName}
        else
            echo "Cancelled start service."
        fi
    fi
else
    echo "Cancelled daemon reload."
fi

`;

    return new NextResponse(out);
}

export { handler as GET, handler as POST };
