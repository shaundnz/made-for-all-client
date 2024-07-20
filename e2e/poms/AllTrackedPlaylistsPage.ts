import { expect, Page } from '@playwright/test';
import { boxedStep } from './utils';

export class AllTrackedPlaylistsPage {
  constructor(private readonly page: Page) {}

  @boxedStep
  async verifyOnPage() {
    await expect(
      this.page.getByRole('heading', {
        level: 1,
        name: 'All Tracked Playlists:',
      }),
    ).toBeVisible();
  }

  @boxedStep
  async verifyMostRecentlyTrackedPlaylist(playlistTitle: string) {
    await expect(
      this.page
        .getByTestId('tracked-playlist-preview')
        .first()
        .getByText(playlistTitle),
    ).toBeVisible({ timeout: 10000 });
  }

  @boxedStep
  async clickTrackedPlaylistLink(playlistTitle: string) {
    await this.page
      .getByTestId('tracked-playlist-preview')
      .filter({ has: this.page.getByText(playlistTitle) })
      .getByRole('link', { name: 'Go to playlist' })
      .click();
  }

  @boxedStep
  async clickNavBarHome() {
    await this.page.getByRole('link', { name: 'Home' }).click();
  }
}
