import { SpraypaintBase, Model, MiddlewareStack } from 'spraypaint';

@Model()
export default class ApplicationRecord extends SpraypaintBase {
  static baseUrl = process.env.VUE_APP_API_BASE;

  static apiNamespace = process.env.VUE_APP_API_NAMESPACE;

  static url(id?: string | number): string {
    return `${super.url(id)}/`; // Add Django's trailing slash.
  }

  static generateAuthHeader(token: string) {
    return `Token ${token}`;
  }

  static listHeaders() {
    throw new Error('add list headers to Class');
  }

  static scopeFactory() {
    throw new Error('add scope factory to Class');
  }
}

const middlewareStack = new MiddlewareStack();

// redirect on 401 unauthorised
middlewareStack.afterFilters.push((response, json) => {
  if (response.status === 401) {
    localStorage.removeItem('jwt');
    window.location.href = `/?next=${window.location.pathname}`;
  }
});

// add jsonAPI errors to response
middlewareStack.afterFilters.push((response, json) => {
  // @ts-ignore
  response.errors = json.errors || [];
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
