import { RequestHolder } from "./requestHolder";
import type {
  Product,
  ProductResponse,
  ProductListResponse,
  ProductSearchResponse,
  ProductAddResponse,
  SuccessResponse,
} from "./models";
import { env } from "../env";
import { step } from "../utils/reporters/step";

export class ProductController extends RequestHolder {
  @step()
  async getBySlug(slug: string): Promise<ProductResponse> {
    const response = await this.request.get(
      `${env.API_URL}/product/item/${slug}`
    );
    return this.handleResponse<ProductResponse>(response);
  }

  @step()
  async searchByName(name: string): Promise<ProductSearchResponse> {
    const response = await this.request.get(
      `${env.API_URL}/product/list/search/${name}`
    );
    return this.handleResponse<ProductSearchResponse>(response);
  }

  @step()
  async getList(params?: {
    page?: number;
    limit?: number;
    sortOrder?: Record<string, number>;
    rating?: number;
    min?: number;
    max?: number;
    category?: string;
  }): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortOrder)
      queryParams.append("sortOrder", JSON.stringify(params.sortOrder));
    if (params?.rating)
      queryParams.append("rating", params.rating.toString());
    if (params?.min) queryParams.append("min", params.min.toString());
    if (params?.max) queryParams.append("max", params.max.toString());
    if (params?.category) queryParams.append("category", params.category);

    const response = await this.request.get(
      `${env.API_URL}/product/list?${queryParams.toString()}`
    );
    return this.handleResponse<ProductListResponse>(response);
  }

  @step()
  async getByBrand(slug: string): Promise<ProductListResponse> {
    const response = await this.request.get(
      `${env.API_URL}/product/list/brand/${slug}`
    );
    return this.handleResponse<ProductListResponse>(response);
  }

  @step()
  async getProductNames(): Promise<{ products: Product[] }> {
    const response = await this.request.get(
      `${env.API_URL}/product/list/select`
    );
    return this.handleResponse<{ products: Product[] }>(response);
  }

  @step()
  async getAll(): Promise<{ products: Product[] }> {
    const response = await this.request.get(`${env.API_URL}/product`);
    return this.handleResponse<{ products: Product[] }>(response);
  }

  @step()
  async getById(id: string): Promise<ProductResponse> {
    const response = await this.request.get(`${env.API_URL}/product/${id}`);
    return this.handleResponse<ProductResponse>(response);
  }

  @step()
  async add(
    data: FormData | Record<string, any>
  ): Promise<ProductAddResponse> {
    const response = await this.request.post(`${env.API_URL}/product/add`, {
      data,
    });
    return this.handleResponse<ProductAddResponse>(response);
  }

  @step()
  async update(id: string, data: { product: Partial<Product> }): Promise<SuccessResponse> {
    const response = await this.request.put(`${env.API_URL}/product/${id}`, {
      data,
    });
    return this.handleResponse<SuccessResponse>(response);
  }

  @step()
  async updateActive(
    id: string,
    isActive: boolean
  ): Promise<SuccessResponse> {
    const response = await this.request.put(
      `${env.API_URL}/product/${id}/active`,
      {
        data: { product: { isActive } },
      }
    );
    return this.handleResponse<SuccessResponse>(response);
  }

  @step()
  async delete(id: string): Promise<SuccessResponse> {
    const response = await this.request.delete(
      `${env.API_URL}/product/delete/${id}`
    );
    return this.handleResponse<SuccessResponse>(response);
  }
}

