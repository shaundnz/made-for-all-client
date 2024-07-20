import { test, expect } from '@playwright/test';
import { AllTrackedPlaylistsPage, HomePage, SpotifyPlaylistPage } from './poms';
import { ApiHelper } from './ApiHelper';

const spotifyPlaylistId = '37i9dQZF1E8OODrDnXXklo';
const playlistTitle = 'Not For Nothing Radio';

const baseUrl = process.env.VITE_APP_BASE_URL || 'http://localhost:5173';
const apiBaseUrl = process.env.VITE_APP_API_BASE_URL || 'http://localhost:3000';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl);
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
  // const spotifyPagePromise = spotifyPlaylistPage.getPagePromise();
  // await homePage.clickNewTrackedPlaylistLink();
  // const spotifyPage = await spotifyPagePromise;
  await spotifyPlaylistPage.verifyOnSpotifyPlaylistPage(
    () => homePage.clickNewTrackedPlaylistLink(),
    playlistTitle,
  );
  // await spotifyPlaylistPage.verifyOnSpotifyPlaylistPage2(
  //   spotifyPage,
  //   playlistTitle,
  // );
  // await spotifyPage.close();

  // Verify on all tracked playlists page
  await homePage.goToAllTrackedPlaylistsPage();
  await allTrackedPlaylistsPage.verifyOnPage();
  await allTrackedPlaylistsPage.verifyMostRecentlyTrackedPlaylist(
    playlistTitle,
  );

  // const spotifyPagePromise = page
  //   .context()
  //   .waitForEvent('page', { timeout: 3000 });
  // await page.getByRole('link', { name: 'Go to playlist' }).first().click();
  // const spotifyPage = await spotifyPagePromise;
  // await expect(spotifyPage).toHaveURL(
  //   /^https:\/\/open\.spotify\.com\/playlist\/[A-Za-z0-9]{22}$/,
  // );

  // Verify Spotify link
  // spotifyPlaylistPage.verifyOnSpotifyPlaylistPage(async () => {
  //   await page.getByRole('link', { name: 'Go to playlist' }).first().click();
  // }, playlistTitle);
  // const spotifyPagePromise2 = spotifyPlaylistPage.getPagePromise();
  // await allTrackedPlaylistsPage.clickTrackedPlaylistLink(playlistTitle);
  // const spotifyPage2 = await spotifyPagePromise2;
  await spotifyPlaylistPage.verifyOnSpotifyPlaylistPage(
    () => allTrackedPlaylistsPage.clickTrackedPlaylistLink(playlistTitle),
    playlistTitle,
  );
  // await spotifyPlaylistPage.verifyOnSpotifyPlaylistPage2(
  //   spotifyPage2,
  //   playlistTitle,
  // );
  // await spotifyPage2.close();

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
