import { RequestHolder } from "./requestHolder";
import type {
  NewsletterSubscribeRequest,
  NewsletterSubscribeResponse,
} from "./models";
import { env } from "../env";
import { step } from "../utils/reporters/step";

export class NewsletterController extends RequestHolder {
  @step()
  async subscribe(
    data: NewsletterSubscribeRequest
  ): Promise<NewsletterSubscribeResponse> {
    const response = await this.request.post(`${env.API_URL}/newsletter/subscribe`, {
      data,
    });
    return this.handleResponse<NewsletterSubscribeResponse>(response);
  }
}
