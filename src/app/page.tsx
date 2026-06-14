"use client";
import { useEffect, useState } from "react";
import AutoField from "../components/AutoField";
import VolumeCreator from "../components/VolumeCreator";
import VolumeDisplay, {
    type VolumeDisplayProps,
} from "@/components/VolumeDisplay";
import LZString from "lz-string";

export const dynamic = "force-dynamic";

const toAppName = (value: string) => value.toLowerCase().replaceAll(" ", "-");
const toAppImage = (value: string) => `ghcr.io/mozza86/${value}:latest`;
const toAppDescription = (value: string) => `${value} Container`;
const toAppDomain = (value: string) => `${value}.a4r.fr`;

export default function Home() {
    const [appTitle, setAppTitle] = useState("");
    const [appName, setAppName] = useState("");
    const [isAppNameManual, setIsAppNameManual] = useState(false);
    const [appImage, setAppImage] = useState("");
    const [isAppImageManual, setIsAppImageManual] = useState(false);
    const [appDescription, setAppDescription] = useState("");
    const [isAppDescriptionManual, setIsAppDescriptionManual] = useState(false);
    const [appPort, setAppPort] = useState(3000);
    const [appDomain, setAppDomain] = useState("");
    const [isAppDomainManual, setIsAppDomainManual] = useState(false);

    const [appVolumes, setAppVolumes] = useState<VolumeDisplayProps[]>([]);

    const payload = {
        title: appTitle,
        name: appName,
        image: appImage,
        description: appDescription,
        port: appPort,
        domain: appDomain,
        volumes: appVolumes,
    };
    const encoded = LZString.compressToEncodedURIComponent(
        JSON.stringify(payload),
    );
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        setShareUrl(`${window.location.origin}/share/${encoded}`);
    }, [encoded]);

    function onVolumeAdd(volume: VolumeDisplayProps) {
        setAppVolumes((prev) => [...prev, volume]);
    }

    useEffect(() => {
        if (!isAppNameManual) {
            setAppName(toAppName(appTitle));
        }
    }, [appTitle, isAppNameManual]);

    useEffect(() => {
        if (!isAppDescriptionManual) {
            setAppDescription(toAppDescription(appTitle));
        }
    }, [appTitle, isAppDescriptionManual]);

    useEffect(() => {
        if (!isAppImageManual) {
            setAppImage(toAppImage(appName));
        }
    }, [appName, isAppImageManual]);

    useEffect(() => {
        if (!isAppDomainManual) {
            setAppDomain(toAppDomain(appName));
        }
    }, [appName, isAppDomainManual]);

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

${appVolumes.map((v) => `Volume=${v.volName}.volume:${v.volPath}:Z`).join("\n")}

[Install]
WantedBy=default.target`;

    return (
        <div className="p-6 w-full mx-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-extrabold mb-1">
                    Podman Quadlet Generator
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fill fields or toggle auto to generate sensible defaults.
                </p>
            </header>

            <section className="flex w-full gap-6">
                <section className="flex flex-col max-h-full flex-1 gap-6">
                    <section className="bg-white/60 dark:bg-black/60 border rounded-lg p-4 shadow-sm">
                        <div className="flex gap-3 mb-4">
                            <label className="flex flex-col flex-1">
                                <span className="text-sm font-medium">
                                    App Title
                                </span>
                                <input
                                    placeholder="app title"
                                    value={appTitle}
                                    onChange={(e) =>
                                        setAppTitle(e.target.value)
                                    }
                                    className="mt-2 rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </label>
                            <label className="flex flex-col">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        App Port
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        TCP
                                    </span>
                                </div>
                                <input
                                    placeholder="app port"
                                    value={appPort}
                                    max={65535}
                                    min={0}
                                    type="number"
                                    onChange={(e) =>
                                        setAppPort(Number(e.target.value))
                                    }
                                    className="mt-2 rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </label>
                        </div>

                        <details>
                            <AutoField
                                label="App Name"
                                placeholder="app name"
                                value={appName}
                                isManual={isAppNameManual}
                                setManual={setIsAppNameManual}
                                onChange={(v) => setAppName(v)}
                            />
                            <AutoField
                                label="App Image"
                                placeholder="app image"
                                value={appImage}
                                isManual={isAppImageManual}
                                setManual={setIsAppImageManual}
                                onChange={(v) => setAppImage(v)}
                            />
                            <AutoField
                                label="App Description"
                                placeholder="app description"
                                value={appDescription}
                                isManual={isAppDescriptionManual}
                                setManual={setIsAppDescriptionManual}
                                onChange={(v) => setAppDescription(v)}
                            />
                            <AutoField
                                label="App Domain"
                                placeholder="app domain"
                                value={appDomain}
                                isManual={isAppDomainManual}
                                setManual={setIsAppDomainManual}
                                onChange={(v) => setAppDomain(v)}
                            />
                        </details>
                    </section>

                    <VolumeCreator base={appTitle} onVolumeAdd={onVolumeAdd} />
                </section>

                <section className="flex-2 gap-2 flex flex-col">
                    <pre className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 border rounded-md p-4 text-sm overflow-auto">
                        {config}
                    </pre>

                    {appVolumes.map((vol) => (
                        <VolumeDisplay
                            key={`${vol.volName}-${vol.volPath}`}
                            volTitle={vol.volTitle}
                            volName={vol.volName}
                            volPath={vol.volPath}
                        />
                    ))}

                    {shareUrl ? (
                        <>
                            <a
                                className="text-sm text-blue-600 underline break-all"
                                href={shareUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {shareUrl}
                            </a>
                            <button type={"button"} onClick={() => navigator.clipboard.writeText(`curl ${shareUrl} | sudo bash`)} className="text-sm cursor-pointer text-gray-500 hover:text-gray-700">
                                Copy Share URL
                            </button>
                        </>
                    ) : null}
                </section>
            </section>
        </div>
    );
}
