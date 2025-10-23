import { RequestHolder } from "./requestHolder";
import type {
  CartAddRequest,
  CartAddResponse,
  CartProductAddRequest,
  SuccessResponse,
} from "./models";
import { env } from "../env";
import { step } from "../utils/reporters/step";

export class CartController extends RequestHolder {
  @step()
  async add(data: CartAddRequest): Promise<CartAddResponse> {
    const response = await this.request.post(`${env.API_URL}/cart/add`, {
      data,
    });
    return this.handleResponse<CartAddResponse>(response);
  }

  @step()
  async delete(cartId: string): Promise<SuccessResponse> {
    const response = await this.request.delete(
      `${env.API_URL}/cart/delete/${cartId}`
    );
    return this.handleResponse<SuccessResponse>(response);
  }

  @step()
  async addProduct(
    cartId: string,
    data: CartProductAddRequest
  ): Promise<SuccessResponse> {
    const response = await this.request.post(
      `${env.API_URL}/cart/add/${cartId}`,
      {
        data,
      }
    );
    return this.handleResponse<SuccessResponse>(response);
  }

  @step()
  async deleteProduct(
    cartId: string,
    productId: string
  ): Promise<SuccessResponse> {
    const response = await this.request.delete(
      `${env.API_URL}/cart/delete/${cartId}/${productId}`
    );
    return this.handleResponse<SuccessResponse>(response);
  }
}

