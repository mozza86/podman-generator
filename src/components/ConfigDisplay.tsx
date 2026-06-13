import React from "react";

export interface VolumeSpec {
    volName: string;
    volPath: string;
}

export interface ConfigDisplayProps {
    appDescription: string;
    appImage: string;
    appPort: string | number;
    appName: string;
    appDomain: string;
    appVolumes?: VolumeSpec[];
}

export function buildConfig({
    appDescription,
    appImage,
    appPort,
    appName,
    appDomain,
    appVolumes = [],
}: ConfigDisplayProps) {
    const volumes = appVolumes
        .map((v) => `Volume=${v.volName}.volume:${v.volPath}:Z`)
        .join("\n");

    const config = `# /etc/containers/systemd/${appName}.container

[Unit]
Description=${appDescription}
After=network-online.target
Wants=network-online.target

[Container]
Image=${appImage}
Pull=always
AutoUpdate=registry

Network=traefik-net

Environment=PORT=${appPort}
Environment=HOST=0.0.0.0
Environment=NODE_ENV=production

Label=traefik.enable=true
Label=traefik.http.routers.${appName}.rule=Host(\`${appDomain}\`)
Label=traefik.http.routers.${appName}.entrypoints=web
Label=traefik.http.services.${appName}.loadbalancer.server.port=${appPort}

${volumes}

[Install]
WantedBy=default.target`;

    return config;
}

export const ConfigDisplay: React.FC<ConfigDisplayProps> = (props) => {
    const config = buildConfig(props);

    return (
        <div>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                <code>{config}</code>
            </pre>
        </div>
    );
};

export default ConfigDisplay;
