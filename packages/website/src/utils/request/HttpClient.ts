/*
 * @Author: Lvhz
 * @Date: 2021-12-06 10:33:00
 * @Description: Description
 */
import qs from 'qs';
import Fetch, { FetchEnv } from './Fetch';
export default class HttpClient {
  private newFetch : Fetch
  headerConfig : any = {
    'Content-Type': 'application/json'
  }

  constructor(env : FetchEnv, timeout: number) {
    this.newFetch = new Fetch(env, timeout);
  }

  setHeader(key : string, value : any) {
    this.headerConfig[key] = value
  }
  get(url : string, params : Object = {}) {
    let config : any = {
      method: 'GET',
      headers: {
        ...this.headerConfig,
      }
    }
    const obj = qs.parse(url.split('?')[1])
    Object.entries(params).forEach(item => {
      obj[item[0]] = item[1]
    })
    return fetch(url.split('?')[0] + '?' + qs.stringify(obj), config)
  }
  delete(url : string, params : Object = {}) {
    let config : any = {
      method: 'DELETE',
      headers: {
        ...this.headerConfig,
      }
    }
    const obj = qs.parse(url.split('?')[1])
    Object.entries(params).forEach(item => {
      obj[item[0]] = item[1]
    })
    return fetch(url.split('?')[0] + '?' + qs.stringify(obj), config)
  }
  post(url : string, params : Object = {}) {
    let config : any = {
      method: 'POST',
      headers: {
        ...this.headerConfig,
      },
      body: JSON.stringify(params)
    }
    return fetch(url, config)
  }
  put(url : string, params : Object = {}) {
    let config : any = {
      method: 'PUT',
      headers: {
        ...this.headerConfig,
      },
      body: JSON.stringify(params)
    }
    return fetch(url, config)
  }
}
