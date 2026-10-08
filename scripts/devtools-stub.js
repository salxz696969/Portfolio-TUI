// Build-time stand-in for react-devtools-core, which Ink only loads when
// DEV=true. Keeps the optional dependency out of the production bundle.
export default { initialize() {}, connectToDevTools() {} };
