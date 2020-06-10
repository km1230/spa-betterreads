const useProxy = !!process.env.VUE_APP_PROXY;
const proxyDomain = useProxy ? new URL(process.env.VUE_APP_PROXY).hostname : '';

module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    disableHostCheck: true,
    proxy: useProxy
      ? {
          [process.env.VUE_APP_API_NAMESPACE]: {
            target: process.env.VUE_APP_PROXY,
            changeOrigin: true,
            logLevel: 'debug',
            onProxyReq(proxyReq, req, res) {
              // fix referer so that django doesn't complain
              // about insecure referer vs secure host (csrf)
              proxyReq.setHeader('referer', process.env.VUE_APP_PROXY);
            },
            onProxyRes: proxyResponse => {
              // rip out secure so we can send and receive cookies on http
              if (proxyResponse.headers['set-cookie']) {
                const cookies = proxyResponse.headers[
                  'set-cookie'
                ].map(cookie => cookie.replace(/; secure/gi, ''));
                proxyResponse.headers['set-cookie'] = cookies;
              }
            },
            // if the backend sets the domain for a cookie, rewrite it
            cookieDomainRewrite: {
              [proxyDomain]: '',
            },
          },
        }
      : false,
  },
};
