interface ResultPreviewProps {
    color: string;
}

export default function ResultPreview({ color }: ResultPreviewProps) {
    return <>{color != "" && <div className="result-preview" style={{ background: color }}></div>}</>;
}
