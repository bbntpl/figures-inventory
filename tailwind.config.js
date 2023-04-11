/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
		'./views/**/*.{html,js,pug}',
	],
	darkMode: 'class',
  theme: {
    extend: {
			backgroundColor: {
        'primary': 'rgb(59 130 246)', // Replace with your primary color hex code.
      },
      textColor: {
        'primary': 'rgb(59 130 246)', // Replace with your primary color hex code.
      },
      borderColor: {
        'primary': 'rgb(59 130 246)', // Replace with your primary color hex code.
      },
		},
  },
	variants: {
    extend: {},
  },
  plugins: [],
}

