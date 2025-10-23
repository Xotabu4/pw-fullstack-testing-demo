import { RequestHolder } from "./requestHolder";
import type {
  OrderAddRequest,
  OrderAddResponse,
  OrderListResponse,
  OrderResponse,
  OrderSearchResponse,
  OrderStatusUpdateRequest,
  OrderStatusUpdateResponse,
  SuccessResponse,
} from "./models";
import { env } from "../env";
import { step } from "../utils/reporters/step";

export class OrderController extends RequestHolder {
  @step()
  async add(data: OrderAddRequest): Promise<OrderAddResponse> {
    const response = await this.request.post(`${env.API_URL}/order/add`, {
      data,
    });
    return this.handleResponse<OrderAddResponse>(response);
  }

  @step()
  async search(searchId: string): Promise<OrderSearchResponse> {
    const response = await this.request.get(
      `${env.API_URL}/order/search?search=${searchId}`
    );
    return this.handleResponse<OrderSearchResponse>(response);
  }

  @step()
  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<OrderListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await this.request.get(
      `${env.API_URL}/order?${queryParams.toString()}`
    );
    return this.handleResponse<OrderListResponse>(response);
  }

  @step()
  async getMyOrders(params?: {
    page?: number;
    limit?: number;
  }): Promise<OrderListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await this.request.get(
      `${env.API_URL}/order/me?${queryParams.toString()}`
    );
    return this.handleResponse<OrderListResponse>(response);
  }

  @step()
  async getById(orderId: string): Promise<OrderResponse> {
    const response = await this.request.get(`${env.API_URL}/order/${orderId}`);
    return this.handleResponse<OrderResponse>(response);
  }

  @step()
  async cancel(orderId: string): Promise<SuccessResponse> {
    const response = await this.request.delete(
      `${env.API_URL}/order/cancel/${orderId}`
    );
    return this.handleResponse<SuccessResponse>(response);
  }

  @step()
  async updateItemStatus(
    itemId: string,
    data: OrderStatusUpdateRequest
  ): Promise<OrderStatusUpdateResponse> {
    const response = await this.request.put(
      `${env.API_URL}/order/status/item/${itemId}`,
      {
        data,
      }
    );
    return this.handleResponse<OrderStatusUpdateResponse>(response);
  }
}

