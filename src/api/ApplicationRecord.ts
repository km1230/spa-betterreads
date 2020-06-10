import {
  Scope,
  SpraypaintBase,
  Model,
  MiddlewareStack,
  Attr,
} from 'spraypaint';
import Cookies from 'js-cookie';
import { apiBase, apiNamespace, useCookies } from '@/config';

@Model()
export default class ApplicationRecord extends SpraypaintBase {
  static baseUrl = apiBase;

  static apiNamespace = apiNamespace;

  static url(id?: string | number): string {
    // add Django's trailing slash
    return `${super.url(id)}/`;
  }

  static generateAuthHeader(token: string) {
    return `Token ${token}`;
  }

  static setJWT(jwt: string | undefined) {
    if (useCookies) {
      return;
    }
    if (jwt) {
      Cookies.set('token', jwt);
    } else {
      Cookies.remove('token');
    }
  }

  static getJWT(): string | undefined {
    if (useCookies) {
      return undefined;
    }
    return Cookies.get('token');
  }

  static listHeaders() {
    throw new Error('add list headers to Class');
  }

  static scopeFactory() {
    throw new Error('add scope factory to Class');
  }
}

const middlewareStack = new MiddlewareStack();

// add jsonAPI errors to response
middlewareStack.afterFilters.push(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response: ResponseExt, json: { [index: string]: any }) => {
    response.errors = json.errors || [];
  },
);

middlewareStack.beforeFilters.push((url, options) => {
  const csrf = Cookies.get('csrftoken');
  if (csrf) {
    (options.headers as HeadersExt)['X-CSRFTOKEN'] = csrf;
  }
  options.credentials = useCookies ? 'include' : 'omit';
});

// Allow disassociate to clear FKs
// middleware.beforeFilters.push((url, options) => {
//   if (!('body' in options)) {
//     return;
//   }
//   // @ts-ignore
//   const body: any = JSON.parse(options.body);
//   if ('relationships' in body.data) {
//     for (const rel in body.data.relationships) {
//       if (Array.isArray(body.data.relationships[rel].data)) {
//         const data = body.data.relationships[rel].data;
//         body.data.relationships[rel].data = data.filter(
//           (item: any) => item.method !== 'disassociate',
//         );
//       } else if (body.data.relationships[rel].data.method === 'disassociate') {
//         body.data.relationships[rel] = { data: null };
//       }
//     }
//     options.body = JSON.stringify(body);
//   }
// });

ApplicationRecord.middlewareStack = middlewareStack;
