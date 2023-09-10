interface ControlButtonProps {
    name: string;
    onClick: Function;
}

export default function ControlButton(props: ControlButtonProps) {
    return (
        <div
            className="buttons"
            onClick={() => props.onClick()}
            title="Add color"
        >
            {props.name}
        </div>
    );
}
