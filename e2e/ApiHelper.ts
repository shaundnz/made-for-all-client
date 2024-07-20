import { APIRequestContext, expect } from '@playwright/test';

export class ApiHelper {
  readonly apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  async deletePlaylist(playlistId: string) {
    const response = await this.apiContext.delete(`/playlists/${playlistId}`);
    expect(response.ok()).toBeTruthy();
  }
}
