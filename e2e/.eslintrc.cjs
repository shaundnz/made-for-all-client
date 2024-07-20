module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: 'plugin:playwright/recommended',
  rules: {
    'playwright/expect-expect': [
      'error',
      {
        assertFunctionNames: [
          'verifyOnPage',
          'verifyNewTrackedPlaylist',
          'verifyCarouselPlaylistItem',
          'verifyMostRecentlyTrackedPlaylist',
          'verifyOnSpotifyPlaylistPage',
        ],
      },
    ],
  },
};
