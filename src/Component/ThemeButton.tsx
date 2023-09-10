import React from "react";

const darkTheme = "App-dark.css";
const lightTheme = "App-light.css";
const styleElement = document.querySelector("#ThemeCss") as HTMLAnchorElement;

export default function ThemeButton() {
    const [themeSrc, setThemeSrc] = React.useState<string>(lightTheme);

    React.useEffect(() => {
        styleElement.href = themeSrc;
        if (window.matchMedia("(prefers-color-scheme: dark)")?.matches) {
            setThemeSrc(darkTheme);
        }
    }, []);

    React.useEffect(() => {
        styleElement.href = themeSrc;
    }, [themeSrc]);

    function handleClick() {
        if (themeSrc == lightTheme) {
            setThemeSrc(darkTheme);
        } else {
            setThemeSrc(lightTheme);
        }
    }

    return (
        <div id="theme-wrapper">
            {themeSrc == lightTheme && (
                <button onClick={handleClick} title="Dark mode">
                    <svg width="28" height="28" viewBox="0 0 48 48">
                        <path d="M24 42q-7.5 0-12.75-5.25T6 24q0-7.5 5.25-12.75T24 6q.4 0 .85.025.45.025 1.15.075-1.8 1.6-2.8 3.95-1 2.35-1 4.95 0 4.5 3.15 7.65Q28.5 25.8 33 25.8q2.6 0 4.95-.925T41.9 22.3q.05.6.075.975Q42 23.65 42 24q0 7.5-5.25 12.75T24 42Zm0-3q5.45 0 9.5-3.375t5.05-7.925q-1.25.55-2.675.825Q34.45 28.8 33 28.8q-5.75 0-9.775-4.025T19.2 15q0-1.2.25-2.575.25-1.375.9-3.125-4.9 1.35-8.125 5.475Q9 18.9 9 24q0 6.25 4.375 10.625T24 39Zm-.2-14.85Z" />
                    </svg>
                </button>
            )}
            {themeSrc == darkTheme && (
                <button onClick={handleClick} title="Light mode">
                    <svg width="28" height="28" viewBox="0 0 48 48">
                        <path d="M22.5 7.5V2h3v5.5Zm0 38.5v-5.5h3V46Zm18-20.5v-3H46v3ZM2 25.5v-3h5.5v3ZM37.1 13l-2.15-2.15 3.3-3.3L40.4 9.7ZM9.75 40.45 7.6 38.3l3.3-3.3 2.15 2.15Zm28.5 0-3.3-3.3L37.1 35l3.3 3.3ZM10.9 13 7.6 9.7l2.15-2.15 3.3 3.3ZM24 35.25q-4.7 0-7.975-3.275Q12.75 28.7 12.75 24q0-4.7 3.275-7.975Q19.3 12.75 24 12.75q4.7 0 7.975 3.275Q35.25 19.3 35.25 24q0 4.7-3.275 7.975Q28.7 35.25 24 35.25Zm0-3q3.45 0 5.85-2.4 2.4-2.4 2.4-5.85 0-3.45-2.4-5.85-2.4-2.4-5.85-2.4-3.45 0-5.85 2.4-2.4 2.4-2.4 5.85 0 3.45 2.4 5.85 2.4 2.4 5.85 2.4ZM24 24Z" />
                    </svg>
                </button>
            )}
        </div>
    );
}
