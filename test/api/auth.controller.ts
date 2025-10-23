import { RequestHolder } from "./requestHolder";
import type {
  LoginRequest,
  LoginResponse,
  UserCreateRequest,
  UserCreatedResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "./models";
import { env } from "../env";
import { step } from "../utils/reporters/step";

export class AuthController extends RequestHolder {
  @step()
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request.post(`${env.API_URL}/auth/login`, {
      data,
    });
    return this.handleResponse<LoginResponse>(response);
  }

  @step()
  async register(data: UserCreateRequest): Promise<UserCreatedResponse> {
    const response = await this.request.post(`${env.API_URL}/auth/register`, {
      data,
    });
    return this.handleResponse<UserCreatedResponse>(response);
  }

  @step()
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    const response = await this.request.post(`${env.API_URL}/auth/forgot`, {
      data,
    });
    return this.handleResponse<ForgotPasswordResponse>(response);
  }

  @step()
  async resetPasswordWithToken(
    token: string,
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    const response = await this.request.post(
      `${env.API_URL}/auth/reset/${token}`,
      {
        data,
      }
    );
    return this.handleResponse<ResetPasswordResponse>(response);
  }

  @step()
  async changePassword(
    data: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    const response = await this.request.post(`${env.API_URL}/auth/reset`, {
      data,
    });
    return this.handleResponse<ChangePasswordResponse>(response);
  }
}
