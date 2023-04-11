// functions to be included in the pug view templates
document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

export function toggleDarkMode() {
	document.body.classList.toggle('dark');
}