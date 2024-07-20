import { expect, Page } from '@playwright/test';
import { boxedStep } from './utils';

export class SpotifyPlaylistPage {
  constructor(private readonly page: Page) {}

  @boxedStep
  async verifyOnSpotifyPlaylistPage(
    navigationCallback: () => Promise<void>,
    playlistTitle: string,
  ) {
    const spotifyPagePromise = this.page
      .context()
      .waitForEvent('page', { timeout: 1000 });
    await navigationCallback();
    const spotifyPage = await spotifyPagePromise;
    await expect(spotifyPage).toHaveURL(
      /^https:\/\/open\.spotify\.com\/playlist\/[A-Za-z0-9]{22}$/,
    );

    await expect(
      spotifyPage.getByRole('heading', {
        level: 1,
        name: `MadeForAll - ${playlistTitle}`,
      }),
    ).toBeVisible({ timeout: 10000 });

    await spotifyPage.close();
  }
}
