import { test, expect } from '@playwright/test';
import { AllTrackedPlaylistsPage, HomePage, SpotifyPlaylistPage } from './poms';
import { ApiHelper } from './ApiHelper';

const spotifyPlaylistId = '37i9dQZF1E8OODrDnXXklo';
const playlistTitle = 'Not For Nothing Radio';

const apiBaseUrl = process.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('MadeForAll');
});

test.afterAll('Cleanup', async ({ playwright }) => {
  const apiContext = await playwright.request.newContext({
    baseURL: apiBaseUrl,
  });
  const api = new ApiHelper(apiContext);
  await api.deletePlaylist(spotifyPlaylistId);
});

test('user can track a playlist', async ({ page }) => {
  const homePage = new HomePage(page);
  const allTrackedPlaylistsPage = new AllTrackedPlaylistsPage(page);
  const spotifyPlaylistPage = new SpotifyPlaylistPage(page);

  // Track the playlist
  await homePage.verifyOnPage();
  await homePage.trackPlaylist(spotifyPlaylistId);
  await homePage.verifyNewTrackedPlaylist(playlistTitle);

  // Verify Spotify link
  await spotifyPlaylistPage.verifyOnSpotifyPlaylistPage(
    () => homePage.clickNewTrackedPlaylistLink(),
    playlistTitle,
  );
  // Verify on all tracked playlists page
  await homePage.goToAllTrackedPlaylistsPage();
  await allTrackedPlaylistsPage.verifyOnPage();
  await allTrackedPlaylistsPage.verifyMostRecentlyTrackedPlaylist(
    playlistTitle,
  );

  // Verify Spotify link
  await spotifyPlaylistPage.verifyOnSpotifyPlaylistPage(
    () => allTrackedPlaylistsPage.clickTrackedPlaylistLink(playlistTitle),
    playlistTitle,
  );

  // Go to home
  await allTrackedPlaylistsPage.clickNavBarHome();
  await homePage.verifyOnPage();
  await homePage.verifyCarouselPlaylistItem(playlistTitle);

  // Verify carousel Spotify link
  await spotifyPlaylistPage.verifyOnSpotifyPlaylistPage(
    () => homePage.clickCarouselPlaylistItem(playlistTitle),
    playlistTitle,
  );
});
