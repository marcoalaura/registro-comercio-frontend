import axios from 'axios';
import https from 'https';

const $Firmatic = {
  baseUrl: 'https://localhost:4637', // baseurl por defecto
  firmarBase64(base64, name, ci) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `${$Firmatic.baseUrl}/sign`,
        headers: { 'content-type': 'application/json' },
        data: {
          archivo: [{ base64, name }],
          format: 'pades',
          language: 'es',
          ci,
        },
        responseType: 'json',
        withCredentials: false,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      }).then((resp) => {
        if (!resp || !resp.data || !resp.data.files || !resp.data.files.length) {
          console.error('Error', resp);
          reject(new Error('El firmador no ha devuelto el archivo firmado'));
        }
        resolve(resp.data);
      }).catch((error) => {
        error.message = `Axios: ${error.message}`;
        if (error.response && error.response.data) {
          console.error(error.response.data.error);
          error.message = `Firmatic: ${error.response.data.message}`;
        }
        reject(error);
      });
    });
  },
  firmarFile(file, ci) {
    return new Promise((resolve, reject) => {
      if (!(file instanceof File)) {
        return reject(new Error('No se ha enviado un Archivo(File)'));
      }
      if (file.type !== 'application/pdf') {
        return reject(new Error('Solo se permite archivos pdf'));
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      function onload() {
        $Firmatic.firmarBase64(reader.result, file.name, ci).then((resp) => {
          resolve(resp);
        }).catch((err) => {
          reject(err);
        });
      }
      function onerror(error) {
        error.message = `Archivo: ${error.message}`;
        reject(error);
      }
      reader.onload = onload;
      reader.onerror = onerror;
    });
  },
};

export default {
  install: (Vue, config) => {
    if (config.baseUrl) {
      if (config.baseUrl.endsWith('/')) {
        config.baseUrl = config.baseUrl.slice(0, -1);
      }
      $Firmatic.baseUrl = config.baseUrl;
    }
    Vue.prototype.$Firmatic = $Firmatic;
  },
};
