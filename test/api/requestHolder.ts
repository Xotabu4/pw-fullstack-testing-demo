import { APIRequestContext, APIResponse } from "@playwright/test";

export abstract class RequestHolder {
  constructor(protected request: APIRequestContext) {}

  /**
   * Helper method to handle API responses and throw errors for non-2xx status codes
   */
  protected async handleResponse<T>(response: APIResponse): Promise<T> {
    if (!response.ok()) {
      let errorBody: any;
      try {
        errorBody = await response.json();
      } catch {
        // If response is not JSON, try to get it as text
        const errorText = await response.text();
        errorBody = { error: errorText, message: errorText };
      }
      throw new Error(JSON.stringify(errorBody));
    }
    return (await response.json()) as T;
  }
}
