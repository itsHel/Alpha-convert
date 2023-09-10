export type ColorType = [number, number, number, number];

type Result = {
    rgb: string;
    hex: string;
};

export function parseColor(
    color: string,
    ignoreAlpha = false,
): ColorType | false {
    let colors = [];
    let alpha: number = 0;

    if (color.match("#")) {
        // Hex
        color = color.trim();

        if (color.length == 4 || color.length == 5) {
            // Formats #ffff #fff
            for (let i = 1; i < color.length; i++) {
                let val = parseInt(color[i], 16) * 16 + parseInt(color[i], 16);

                if (isNaN(val) || val < 0 || val > 255) return false;

                colors.push(val);
            }

            alpha = colors[3] / 255;
            colors.length = 3;
        } else if (color.length == 7 || color.length == 9) {
            // Formats #ffffffff #ffffff
            for (let i = 1; i < color.length - 1; i = i + 2) {
                let val =
                    parseInt(color[i], 16) * 16 + parseInt(color[i + 1], 16);

                if (isNaN(val) || val < 0 || val > 255) return false;

                colors.push(val);
            }

            alpha = colors[3] / 255;
            colors.length = 3;
        } else {
            return false;
        }
    } else {
        // Rgb
        if (color.match("/")) {
            // Formats: rgba(0 0 0 / 0.8) rgba(0 0 0 / 80%) rgb(0 0 0)
            if (!ignoreAlpha) {
                let temp = color.match(/\/(.+)/);

                if (!temp) return false;

                alpha = parseFloat(temp[1].replace(/[^0-9.]/g, ""));

                if (color.match("%")) {
                    alpha = alpha / 100;
                }
            }

            let temp = color.replace(/\/.+/, "").split(" ");

            for (let i = 0; i < 3; i++) {
                colors[i] = parseInt(temp[i].replace(/\D/g, ""));

                if (isNaN(colors[i]) || colors[i] < 0 || colors[i] > 255)
                    return false;
            }
        } else {
            // Formats: rgba(0,0,0,0.8) rgb(0,0,0)
            let temp: string[] | null = color
                .replace(/\s/g, "")
                .match(/\((\d+),(\d+),(\d+),([0-9.]{1,})|(\d+),(\d+),(\d+)/);

            if (!temp) return false;

            temp = temp.filter((m) => m !== undefined);

            if (!ignoreAlpha) {
                if (!temp[4]) return false;

                alpha = parseFloat(temp[4].replace(/[^0-9.]/g, ""));
            }

            for (let i = 0; i < 3; i++) {
                colors[i] = parseInt(temp[i + 1].replace(/\D/g, ""));

                if (isNaN(colors[i]) || colors[i] < 0 || colors[i] > 255)
                    return false;
            }
        }
    }

    if (!ignoreAlpha && (isNaN(alpha) || alpha >= 1 || alpha <= 0))
        return false;

    if (!ignoreAlpha) {
        colors.push(alpha);
    }

    return colors as ColorType;
}

export function mixColors(
    firstColors: ColorType[],
    secondaryColor: ColorType,
    separator: string,
): Result | false {
    // Use same separator as user in first input
    let rgb = secondaryColor ? "rgb(" : "rgba(";
    let hex = "#";
    let color = [...firstColors[0]];

    // Merge picked colors
    for (let i = 0; i < firstColors.length; i++) {
        if (i + 1 == firstColors.length) break;

        let nextAlpha =
            firstColors[i + 1][3] + color[3] * (1 - firstColors[i + 1][3]);

        for (let j = 0; j < 3; j++) {
            let newColor =
                (firstColors[i + 1][j] * firstColors[i + 1][3] +
                    color[j] * color[3] * (1 - firstColors[i + 1][3])) /
                nextAlpha;
            color[j] = newColor;
        }

        color[3] = nextAlpha;
    }

    // Merge with background color
    for (let i = 0; i < 3; i++) {
        let fullColor;

        if (secondaryColor) {
            fullColor = Math.round(
                color[i] * color[3] +
                    (secondaryColor[i] * 1 * (1 - color[3])) /
                        (color[3] + 1 * (1 - color[3])),
            );
        } else {
            fullColor = color[i];
        }

        if (fullColor > 255 || fullColor < 0) return false;

        rgb += fullColor + (i != 2 ? separator : "");
        hex += fullColor.toString(16).padStart(2, "0");

        if (i == 2) {
            if (secondaryColor) {
                rgb += ")";
            } else {
                // Show alpha if background color not defined
                rgb += separator + color[3] + ")";
                hex += Math.round(color[3] * 255).toString(16);
            }
        }
    }

    return {
        rgb: rgb,
        hex: hex,
    };
}
