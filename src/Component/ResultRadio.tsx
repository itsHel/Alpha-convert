import React from "react";

let timeout: ReturnType<typeof setTimeout>;

interface ResultRadioProps {
    radioTypes: string[];
    startIndex: number;
    shiftTime: number;
    onRadioChange: Function;
}

export default function ResultRadio(props: ResultRadioProps) {
    const labelWrapperRef = React.useRef<HTMLDivElement>(null!);
    const lineRef = React.useRef<HTMLDivElement>(null!);
    const labelRefs = React.useRef<HTMLLabelElement[]>([]);
    const [lineStyle, setLineStyle] = React.useState<React.CSSProperties>({
        transition: props.shiftTime + "ms",
    });

    const checkedIndex = React.useRef(props.startIndex);
    const lastActiveIndex = React.useRef(props.startIndex);

    function handleChange(e: React.ChangeEvent | null, newIndex: number) {
        const label = labelRefs.current[newIndex];
        checkedIndex.current = newIndex;
        props.onRadioChange(props.radioTypes[newIndex].toLowerCase());

        if (label && lineRef.current) {
            if (
                !lineStyle.width ||
                lineStyle.width == "0px" ||
                lineStyle.width == ""
            ) {
                // First click

                let thisWidth = label.offsetWidth;
                let thisLeft = label.offsetLeft;

                setLineStyle({
                    left: thisLeft + "px",
                    width: thisWidth + "px",
                });
            } else {
                let lastIndex = lastActiveIndex.current;

                if (newIndex == lastIndex) return;

                clearTimeout(timeout);

                if (newIndex > lastIndex) {
                    // Left to right
                    let fullWidth =
                        label.offsetLeft -
                        lineRef.current.offsetLeft +
                        label.offsetWidth;

                    setLineStyle({
                        left: lineRef.current.offsetLeft + "px",
                        right: "auto",
                        width: fullWidth + "px",
                    });

                    timeout = setTimeout(function () {
                        setLineStyle({
                            left: label.offsetLeft + "px",
                            width: label.offsetWidth + "px",
                        });
                    }, props.shiftTime);
                } else {
                    // Right to left
                    let lineOffsetRight =
                        lineRef.current.offsetLeft +
                        lineRef.current.offsetWidth;
                    let rightPos =
                        labelWrapperRef.current.offsetWidth - lineOffsetRight;
                    let fullWidth = lineOffsetRight - label.offsetLeft;

                    setLineStyle({
                        left: "auto",
                        right: rightPos + "px",
                        width: fullWidth + "px",
                    });

                    timeout = setTimeout(function () {
                        setLineStyle({
                            left: "auto",
                            right:
                                labelWrapperRef.current.offsetWidth -
                                (label.offsetLeft + label.offsetWidth) +
                                "px",
                            width: label.offsetWidth + "px",
                        });
                    }, props.shiftTime);
                }
            }

            lastActiveIndex.current = newIndex;
        }
    }

    React.useEffect(() => {
        // Start on position if startIndex defined
        if (props.startIndex > -1) {
            handleChange(null, props.startIndex);
        }
    }, []);

    return (
        <div id="result-radio-wrapper">
            <div ref={labelWrapperRef} id="radios">
                {props.radioTypes.map((radio, i) => {
                    return (
                        <label
                            ref={(el) => (labelRefs.current[i] = el!)}
                            key={i}
                        >
                            <input
                                id={radio + "-radio"}
                                key={i}
                                onChange={() => handleChange(null, i)}
                                className="radio"
                                type="radio"
                                name="myradio"
                                checked={checkedIndex.current == i}
                            />
                            <span>{radio}</span>
                        </label>
                    );
                })}
                <div
                    style={{ ...lineStyle, transition: props.shiftTime + "ms" }}
                    ref={lineRef}
                    className="radio-line"
                ></div>
            </div>
        </div>
    );
}
