"use client";

interface AutoFieldProps {
    label: string;
    value: string;
    placeholder?: string;
    isManual: boolean;
    setManual: (manual: boolean) => void;
    onChange: (value: string) => void;
}

export default function AutoField({
    label,
    value,
    placeholder,
    isManual,
    setManual,
    onChange,
}: AutoFieldProps) {
    return (
        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition">
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <span
                        className={`font-semibold text-sm ${!isManual ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"}`}
                    >
                        {label}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                            {isManual ? "manual" : "auto"}
                        </span>
                        <input
                            aria-label={`${label} auto`}
                            type="checkbox"
                            checked={!isManual}
                            onChange={(e) => {
                                setManual(!e.target.checked);
                            }}
                            className="w-5 h-5 rounded text-blue-600"
                        />
                    </div>
                </div>
                <input
                    placeholder={placeholder ?? label.toLowerCase()}
                    value={value}
                    onChange={(e) => {
                        setManual(true);
                        onChange(e.target.value);
                    }}
                    className={`mt-2 w-full rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${!isManual ? "text-gray-500 dark:text-gray-400 italic" : "text-gray-900 dark:text-gray-100"}`}
                />
            </div>
        </div>
    );
}
