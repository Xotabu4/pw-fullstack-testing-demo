import { RequestHolder } from "./requestHolder";
import type {
  AddressAddRequest,
  AddressAddResponse,
  AddressListResponse,
  AddressResponse,
  AddressUpdateRequest,
  AddressDeleteResponse,
  SuccessResponse,
} from "./models";
import { env } from "../env";
import { step } from "../utils/reporters/step";

export class AddressController extends RequestHolder {
  @step()
  async add(data: AddressAddRequest): Promise<AddressAddResponse> {
    const response = await this.request.post(`${env.API_URL}/address/add`, {
      data,
    });
    return this.handleResponse<AddressAddResponse>(response);
  }

  @step()
  async getAll(): Promise<AddressListResponse> {
    const response = await this.request.get(`${env.API_URL}/address`);
    return this.handleResponse<AddressListResponse>(response);
  }

  @step()
  async getById(id: string): Promise<AddressResponse> {
    const response = await this.request.get(`${env.API_URL}/address/${id}`);
    return this.handleResponse<AddressResponse>(response);
  }

  @step()
  async update(
    id: string,
    data: AddressUpdateRequest
  ): Promise<SuccessResponse> {
    const response = await this.request.put(`${env.API_URL}/address/${id}`, {
      data,
    });
    return this.handleResponse<SuccessResponse>(response);
  }

  @step()
  async delete(id: string): Promise<AddressDeleteResponse> {
    const response = await this.request.delete(
      `${env.API_URL}/address/delete/${id}`
    );
    return this.handleResponse<AddressDeleteResponse>(response);
  }
}
