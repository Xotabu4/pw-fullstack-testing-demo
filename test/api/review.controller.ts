import { RequestHolder } from "./requestHolder";
import type {
  ReviewAddRequest,
  ReviewAddResponse,
  ReviewListResponse,
  ReviewUpdateRequest,
  ReviewDeleteResponse,
  SuccessResponse,
} from "./models";
import { env } from "../env";
import { step } from "../utils/reporters/step";

export class ReviewController extends RequestHolder {
  @step()
  async add(data: ReviewAddRequest): Promise<ReviewAddResponse> {
    const response = await this.request.post(`${env.API_URL}/review/add`, {
      data,
    });
    return this.handleResponse<ReviewAddResponse>(response);
  }

  @step()
  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<ReviewListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await this.request.get(
      `${env.API_URL}/review?${queryParams.toString()}`
    );
    return this.handleResponse<ReviewListResponse>(response);
  }

  @step()
  async getByProductSlug(slug: string): Promise<ReviewListResponse> {
    const response = await this.request.get(`${env.API_URL}/review/${slug}`);
    return this.handleResponse<ReviewListResponse>(response);
  }

  @step()
  async update(
    id: string,
    data: ReviewUpdateRequest
  ): Promise<SuccessResponse> {
    const response = await this.request.put(`${env.API_URL}/review/${id}`, {
      data,
    });
    return this.handleResponse<SuccessResponse>(response);
  }

  @step()
  async approve(reviewId: string): Promise<SuccessResponse> {
    const response = await this.request.put(
      `${env.API_URL}/review/approve/${reviewId}`
    );
    return this.handleResponse<SuccessResponse>(response);
  }

  @step()
  async reject(reviewId: string): Promise<SuccessResponse> {
    const response = await this.request.put(
      `${env.API_URL}/review/reject/${reviewId}`
    );
    return this.handleResponse<SuccessResponse>(response);
  }

  @step()
  async delete(id: string): Promise<ReviewDeleteResponse> {
    const response = await this.request.delete(
      `${env.API_URL}/review/delete/${id}`
    );
    return this.handleResponse<ReviewDeleteResponse>(response);
  }
}
