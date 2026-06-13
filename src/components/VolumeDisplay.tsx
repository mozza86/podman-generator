export interface VolumeDisplayProps {
    volTitle: string;
    volName: string;
    volPath: string;
}

export function buildVolume({ volTitle, volName }: VolumeDisplayProps) {
    const filePath = `/etc/containers/systemd/${volName}.volume`;

    return `# ${filePath}
    
[Unit]
Description=${volTitle} Volume

[Volume]
`;
}

export default function VolumeDisplay({
    volTitle,
    volName,
    volPath,
}: VolumeDisplayProps) {
    const content = buildVolume({ volTitle, volName, volPath });

    return (
        <pre className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 border rounded-md p-3 text-sm">
            {content}
        </pre>
    );
}
