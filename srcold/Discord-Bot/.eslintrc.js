module.exports = {
	globals: {},
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "tsconfig.json",
		sourceType: "module",
	},
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
		node: true,
		jest: true,
		es6: true,
	},
	extends: [
		"plugin:@typescript-eslint/recommended",
		"prettier/@typescript-eslint",
		"standard-with-typescript",
		"plugin:prettier/recommended",
	],
	plugins: ["@typescript-eslint/eslint-plugin", "prettier"],
	rules: {
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"prettier/prettier": "warn",
	},
};
