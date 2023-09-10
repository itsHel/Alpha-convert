export default function Header() {
    return (
        <div id="header">
            <h1>Alpha merger</h1>
            <p>
                Merge overlapping alpha color(s) with background or overlapping
                alpha colors together
            </p>
            <p>
                <span className="text-highlight">Order matters</span> if you are
                combining more than two colors
            </p>
            <p>Allowed formats: rgb(a) / hex</p>
        </div>
    );
}
