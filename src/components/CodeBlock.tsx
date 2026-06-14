import { ClipboardCopy } from "lucide-react";

export default function CodeBlock({
    shareUrl = "http://localhost:3000/share/N4IgLglmA2CmIC4...",
    autoapprove = false,
}) {
    const approveFlags = autoapprove ? " -s -- -y" : "";
    const fullText = `curl -sSL ${shareUrl} | sudo bash${approveFlags}`;

    const maxLength = 60;
    const isTruncated = shareUrl.length > maxLength;

    const half = Math.floor(maxLength / 2);
    const startUrl = shareUrl.slice(0, half);
    const endUrl = shareUrl.slice(-half);

    return (
        <pre className="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded font-mono select-all w-full">
            {/* Hidden layer */}
            <span className="sr-only">{fullText}</span>

            {/* Visual presentation layer */}
            <span
                aria-hidden="true"
                className="flex items-center whitespace-nowrap"
            >
                <span className="mr-1">curl -sSL</span>

                {isTruncated ? (
                    <span className="flex items-center">
                        <span>{startUrl}</span>
                        <span className="font-sans px-0.5 font-bold tracking-tighter text-gray-500 select-none">
                            ...
                        </span>
                        <span>{endUrl}</span>
                    </span>
                ) : (
                    <span>{shareUrl}</span>
                )}

                <span className="ml-1">| sudo bash</span>
                {autoapprove && <span className="ml-1">-s -- -y</span>}
            </span>

            <button
                type="button"
                onClick={() => navigator.clipboard.writeText(fullText)}
                className="text-gray-500 hover:text-gray-700 ml-auto flex items-center shrink-0"
            >
                <ClipboardCopy className="h-4 w-4" />
            </button>
        </pre>
    );
}
