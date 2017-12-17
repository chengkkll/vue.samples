 /* eslint-disable */ 
 import env from '@/config/env';
 const App_ID = env.DAOVOICE_APPID;
 if (App_ID) {
   (function (i, s, o, g, r, a, m) { 
     i['DaoVoiceObject'] = r; 
     i[r] = i[r] || function () { 
       (i[r].q = i[r].q || []).push(arguments) 
     }, 
     i[r].l = 1 * new Date();
     a = s.createElement(o),
     m = s.getElementsByTagName(o)[0];
     a.async = 1;
     a.src = g;
     a.charset = 'utf-8';
     m.parentNode.insertBefore(a, m)
   })(
     window,
     document,
     'script',
     ('https:' === document.location.protocol ? 'https:' : 'http:') + `//widget.daovoice.io/widget/${App_ID}.js`,
     'daovoice');
   daovoice('init', {
     app_id: App_ID,
   });
   daovoice('update');
 }
 