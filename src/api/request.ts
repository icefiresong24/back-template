import axios, { AxiosResponse } from "axios";
import type { AxiosRequestConfig, AxiosInstance, AxiosError } from "axios";
import router from "@/router";
import type {Resdata, RequestConfig, RequestInterceptors } from "./type";
import { ElMessage } from "element-plus";

class Request {
  instance: AxiosInstance;

  constructor(
    config: AxiosRequestConfig,
    intercetorsObj?: RequestInterceptors
  ) {
    this.instance = axios.create(config);
    this.instance.interceptors.request.use(
      (res) => {
        return res;
      },
      (error) => error
    );
    this.instance.interceptors.response.use(
      intercetorsObj?.responseInterceptors,
      intercetorsObj?.responseInterceptorsCatch
    );
    this.instance.interceptors.request.use(
      intercetorsObj?.requestInterceptors,
      intercetorsObj?.requestInterceptorsCatch
    );
  }

  request(config: AxiosRequestConfig) {
    return this.instance.request(config);
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<Resdata<T>> {
    return this.instance.get(url, config);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<Resdata<T>> {
    return this.instance.post(url, data, config);
  }
}
const host = window.location.origin;
console.log(host);

const {VITE_BASE_URL} = import.meta.env;
const interceptors_response = {
  responseInterceptors: (response: AxiosResponse) => {
    const { code, message: msg, data } = response.data;
    if (code == 401) {
      localStorage.clear();
      router.push("/login");
      return;
    }
    if(code == 500) {
      ElMessage({
        type:'error',
        message: msg,
        duration: 1000
      })
      return data;
    }
    return data;
  },
  responseInterceptorsCatch: (error: AxiosError) => {
    console.log(error.response!.request.responseURL, "网络错误");
    
  },
  requestInterceptors: (request: AxiosRequestConfig) => {
    if (localStorage.getItem("Authorization"))
      request.headers!.Authorization = localStorage.getItem(
        "Authorization"
      ) as any;
    return request;
  },
};

const request = new Request(
  {
    baseURL: VITE_BASE_URL,
    timeout: 100000,
  },
  interceptors_response
);

export default { request };