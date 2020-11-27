module.exports = {
	// @see https://tailwindcss.com/docs/upcoming-changes
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
	},
	purge: [
		'./src/components/**/*.js',
		'./pages/**/*.js'],
	theme: {
    fontFamily: {
      lato: [
          'Amiko',
          'sans-serif',
      ],
      mono: [
          'Adamina',
          'monospace',
      ],
    },
		extend: {
      colors: {
          'beige': '#E8E2D7',
          'grey': '#2E3744',
      },
    },
	},
	variants: {},
	plugins: [
		require( 'tailwindcss' ),
		require( 'precss' ),
		require( 'autoprefixer' )
	]
};