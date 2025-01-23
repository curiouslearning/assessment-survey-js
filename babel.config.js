module.exports = {
  presets: [
    '@babel/preset-env', // To transpile modern JavaScript to a compatible version
    '@babel/preset-typescript', // To transpile TypeScript
  ],
  plugins: [
    '@babel/plugin-transform-runtime', // To optimize async/await and other features
  ],
  // If you're using React, add the preset below
  // "jsx": "react" can also be used in the Babel preset for React code
  // presets: [
  //   '@babel/preset-env',
  //   '@babel/preset-react',
  //   '@babel/preset-typescript'
  // ]
};
