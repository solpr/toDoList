export function setTheme(themeName) {
    localStorage.setItem("theme", themeName);
    document.body.className = `${themeName}_theme`;
    document.querySelectorAll("[class^=input_text_]").forEach((input) => {
        input.className = `input_text_${themeName}`;
    });
}

export default function themeInit() {
    const savedTheme = localStorage.getItem("theme");
    setTheme(savedTheme || "light");

    const themeButton = document.getElementById("theme-toggle");
    if (themeButton) {
        themeButton.onclick = () => {
            setTheme(
                document.body.className === "dark_theme" ? "light" : "dark"
            );
        };
    }
}
