/** @type {import('semantic-release').GlobalConfig} */
module.exports = {
  branches: [
    'main',
    {
      name: 'rc',
      channel: 'rc',
      prerelease: 'rc',
    },
  ],
};