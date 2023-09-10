import React from "react";

interface InputProps {
    name: string;
    confirm: Function;
    placeholder?: string;
    handleChange?: Function;
    value?: string;
}

export default function Input(props: InputProps) {
    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == "Enter") {
            props.confirm(true);
        }
    }

    return (
        <label className="input-placeholder input-placeholder-color">
            <input
                id="color-background"
                onChange={(e: React.ChangeEvent) => {
                    if (props.handleChange) props.handleChange(e);
                }}
                onKeyDown={onKeyDown}
                placeholder={props.placeholder || ""}
                spellCheck="false"
                value={props.value}
            />
            <span>{props.name}</span>
        </label>
    );
}
