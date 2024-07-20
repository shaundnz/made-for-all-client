import { expect, Page } from '@playwright/test';
import { boxedStep } from './utils';

export class HomePage {
  constructor(private readonly page: Page) {}

  @boxedStep
  async verifyOnPage() {
    await expect(
      this.page.getByRole('heading', { level: 1, name: 'Made For All!' }),
    ).toBeVisible();
  }

  @boxedStep
  async trackPlaylist(playlistId: string) {
    await this.page
      .getByLabel('Spotify playlist link')
      .fill(`https://open.spotify.com/playlist/${playlistId}`);

    const button = this.page.getByRole('button', { name: 'Track Playlist' });
    await expect(button).toBeEnabled();
    await this.page.getByRole('button', { name: 'Track Playlist' }).click();
  }

  @boxedStep
  async verifyNewTrackedPlaylist(playlistTitle: string) {
    const playlistPreview = this.page.getByTestId('tracked-playlist-preview');
    await expect(playlistPreview).toBeVisible({ timeout: 10000 });
    await expect(playlistPreview.getByText(playlistTitle)).toBeVisible();
    await expect(
      playlistPreview.getByRole('link', { name: 'Go to playlist' }),
    ).toBeVisible();
  }

  @boxedStep
  async clickNewTrackedPlaylistLink() {
    await this.page.getByRole('link', { name: 'Go to playlist' }).click();
  }

  @boxedStep
  async verifyCarouselPlaylistItem(playlistTitle: string) {
    await expect(
      this.page
        .getByTestId('carousel-playlist-item')
        .filter({ has: this.page.getByRole('link', { name: playlistTitle }) }),
    ).toBeVisible({ timeout: 10000 });
  }

  @boxedStep
  async clickCarouselPlaylistItem(playlistTitle: string) {
    await this.page
      .getByTestId('carousel-playlist-item')
      .filter({ has: this.page.getByRole('link', { name: playlistTitle }) })
      .click();
  }

  @boxedStep
  async goToAllTrackedPlaylistsPage() {
    await this.page
      .getByRole('link', { name: 'View All Tracked Playlists' })
      .click();
  }
}
