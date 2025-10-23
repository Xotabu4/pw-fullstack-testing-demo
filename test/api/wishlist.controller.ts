import { RequestHolder } from "./requestHolder";
import type {
  WishlistRequest,
  WishlistResponse,
  WishlistListResponse,
} from "./models";
import { env } from "../env";
import { step } from "../utils/reporters/step";

export class WishlistController extends RequestHolder {
  @step()
  async addOrUpdate(data: WishlistRequest): Promise<WishlistResponse> {
    const response = await this.request.post(`${env.API_URL}/wishlist`, {
      data,
    });
    return this.handleResponse<WishlistResponse>(response);
  }

  @step()
  async getAll(): Promise<WishlistListResponse> {
    const response = await this.request.get(`${env.API_URL}/wishlist`);
    return this.handleResponse<WishlistListResponse>(response);
  }
}
