"use client";
import { useEffect, useState } from "react";
import AutoField from "./AutoField";
import VolumeDisplay, {
    type VolumeDisplayProps,
} from "@/components/VolumeDisplay";

const toVolumeName = (value: string) =>
    value
        .toLowerCase()
        .replaceAll(" ", "-")
        .replace(/[^a-z0-9-_]/g, "");

interface VolumeCreatorProps {
    base?: string;
    onVolumeAdd?: (volume: VolumeDisplayProps) => void;
}

export default function VolumeCreator({
    base = "",
    onVolumeAdd,
}: VolumeCreatorProps) {
    const [volTitle, setVolTitle] = useState(`Default ${base}`.trim());
    const [volName, setVolName] = useState("");
    const [isVolNameManual, setIsVolNameManual] = useState(false);
    const [volPath, setVolPath] = useState("/app/data");

    useEffect(() => {
        if (!isVolNameManual) {
            setVolName(toVolumeName(volTitle));
        }
    }, [volTitle, isVolNameManual]);

    function onButtonAdd() {
        if (onVolumeAdd) {
            onVolumeAdd({
                volTitle,
                volName,
                volPath: volPath,
            });
        }
    }

    return (
        <div className="bg-white/60 dark:bg-black/60 border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Create Podman Volume</h3>

            <div className="flex flex-col gap-3 mb-4">
                <label className="flex flex-col">
                    <span className="text-sm font-medium">Volume Title</span>
                    <input
                        placeholder="volume title (human readable)"
                        value={volTitle}
                        onChange={(e) => setVolTitle(e.target.value)}
                        className="mt-2 rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </label>
                <label className="flex flex-col">
                    <span className="text-sm font-medium">Volume Path</span>
                    <input
                        placeholder="volume path"
                        value={volPath}
                        onChange={(e) => setVolPath(e.target.value)}
                        className="mt-2 rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </label>
                <details>
                    <AutoField
                        label="Volume Name"
                        placeholder="volume name"
                        value={volName}
                        isManual={isVolNameManual}
                        setManual={setIsVolNameManual}
                        onChange={(v) => setVolName(v)}
                    />
                </details>

                <button
                    type="button"
                    className="bg-cyan-900 rounded hover:bg-cyan-700 transition cursor-pointer"
                    onClick={() => onButtonAdd()}
                >
                    Add
                </button>

                <VolumeDisplay
                    volTitle={volTitle}
                    volName={volName}
                    volPath={volPath}
                />
            </div>
        </div>
    );
}
