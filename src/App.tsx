import React from "react";
import Input from "./Component/Input";
import ResultRadio from "./Component/ResultRadio";
import ControlButton from "./Component/ControlButton";
import Header from "./Component/Header";
import ThemeButton from "./Component/ThemeButton";
import { Popup } from "./Component/Popup";
import { PopupContext } from "./PopupContext";
import { ColorType, parseColor, mixColors } from "./Color";
import "./App.css";

type ColorInput = string;
type Result = {
    rgb: string;
    hex: string;
};
type ResultType = "rgb" | "hex";

export default function App() {
    const [inputs, setInputs] = React.useState<ColorInput[]>([""]);
    const [backgroundInput, setBackgroundInput] =
        React.useState<ColorInput>("");
    const [resultType, setResultType] = React.useState<ResultType>("rgb");
    const [result, setResult] = React.useState<Result>({ rgb: "", hex: "" });
    const { open } = React.useContext(PopupContext);

    function addInput() {
        let newInput: ColorInput = "";

        setInputs([...inputs, newInput]);
    }

    function removeInput() {
        setInputs([...inputs.slice(0, inputs.length - 1)]);
    }

    function copyResult() {
        let text = result[resultType];

        if (text) {
            navigator.clipboard.writeText(text);

            open({ type: "success", text: "Copied" });
        }
    }

    function backgroundFill() {
        const fillWith = "#ffffff";

        setBackgroundInput(fillWith);
    }

    function handleBackgroundChange(e: React.MouseEvent<HTMLInputElement>) {
        setBackgroundInput(e.currentTarget.value);
        confirm();
    }

    function handleColorChange(
        e: React.MouseEvent<HTMLInputElement>,
        index: number,
    ) {
        let newInputs = inputs;
        newInputs[index] = e.currentTarget.value;

        setInputs(newInputs);
        confirm();
    }

    function confirm(forceWarn = false) {
        let firstColors: ColorType[] = [];

        for (let i = 0; i < inputs.length; i++) {
            let inputVal = inputs[i];

            if (i == 0 || inputVal) {
                let newColor: ColorType | false = parseColor(inputVal);

                if (!newColor) {
                    if (forceWarn) {
                        open({ type: "error", text: "Wrong color format" });
                    }

                    return;
                }

                firstColors.push(newColor);
            }
        }

        let secondaryColor: ColorType | false = parseColor(
            backgroundInput,
            true,
        );

        if (firstColors.length && secondaryColor) {
            let separator = inputs[0].match(",") ? ", " : " ";
            let result: Result | false = mixColors(
                firstColors,
                secondaryColor,
                separator,
            );

            if (!result) {
                open({ type: "error", text: "Wrong alphas" });
                return;
            }

            setResult(result);
        }
    }

    function changeResultType(type: ResultType) {
        setResultType(type);
    }

    return (
        <div>
            <ThemeButton />

            <Header />

            <div id="main">
                <div id="inputs-wrapper">
                    {inputs.map((input, i) => {
                        return (
                            <Input
                                placeholder="Alpha color"
                                handleChange={(
                                    e: React.MouseEvent<HTMLInputElement>,
                                ) => handleColorChange(e, i)}
                                key={i}
                                confirm={confirm}
                                name={"Color " + i}
                            />
                        );
                    })}
                    <div id="input-buttons">
                        <ControlButton onClick={addInput} name="+" />
                        {inputs.length > 1 && (
                            <ControlButton onClick={removeInput} name="-" />
                        )}
                    </div>
                    <div id="background-input-wrapper">
                        <Input
                            value={backgroundInput}
                            placeholder="non-Alpha color"
                            handleChange={handleBackgroundChange}
                            confirm={confirm}
                            name="Background color"
                        />
                        <img
                            onClick={backgroundFill}
                            id="white-fill"
                            title="Fill with white"
                            src="fill.svg"
                        />
                    </div>
                </div>

                <div id="result-wrapper">
                    <div id="result-input-wrapper">
                        <Input
                            value={result[resultType]}
                            placeholder="Result"
                            confirm={confirm}
                            name="Result color"
                        />
                        <img
                            onClick={copyResult}
                            className={result[resultType] ? "" : "disabled"}
                            id="copy"
                            title="Copy"
                            src="copy.svg"
                        />
                    </div>
                    <ResultRadio
                        onRadioChange={(type: ResultType) =>
                            changeResultType(type)
                        }
                        radioTypes={["Rgb", "Hex"]}
                        startIndex={0}
                        shiftTime={250}
                    />
                </div>
            </div>

            <Popup />
        </div>
    );
}
