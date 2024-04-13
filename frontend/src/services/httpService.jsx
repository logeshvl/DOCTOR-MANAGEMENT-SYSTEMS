import axios from 'axios';
import { de } from 'date-fns/locale';
import { Constants } from 'src/constants/stringConstants';
import { CommonHelper } from 'src/utils/commonHelper';
import { CookiesStorage } from 'src/utils/storage';

const getToken = () => {
  let cookie = CookiesStorage.getItem('token');
  return cookie ? cookie : '';
};

const getRequestHeader = (contentType = '', isNeedAutho) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Content-type': contentType === 'form' ? 'multipart/form-data' : 'application/json',

  };

  // Add authorization header if needed
  if (isNeedAutho) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};


const get = (props) => {
  
  let { url, responseType, isNeedAutho = true, successCallback, failureCallback } = props;
  let config = { headers: getRequestHeader('', isNeedAutho) };
  if (responseType) config.responseType = responseType;
  return axios
    .get(url, config)
    .then((result) => result)
    .then((response) => {
      
      if (response.status === 200) {
        if (response.data )
          typeof successCallback === 'function' && successCallback(response.data, response.data);
        else typeof failureCallback === 'function' && failureCallback(response.data.message);
      } else if (response.status === 401) CommonHelper.Logout();
      else failureCallback(Constants.SomethingWentWrongMsg);
    })
    .catch((error) => {
      console.log(error);
      failureCallback(Constants.SomethingWentWrongMsg);
    });
};

const post = (props) => {
  let { url, body, successCallback, failureCallback, contentType, responseType, isNeedAutho = true } = props;
  let config = { 
    headers: getRequestHeader(contentType, isNeedAutho) 
  };
  if (responseType) config.responseType = responseType;
  return axios
    .post(url, body, config)
    .then((result) => result)
    .then((response) => {
     
      if (response.status === 200) {
        if (response.data)
          typeof successCallback === 'function' && successCallback(response.data, response.data);
        else typeof failureCallback === 'function' && failureCallback(response.data.message);
      } else if (response.status === 401) CommonHelper.Logout();
      else typeof successCallback === 'function' && failureCallback(Constants.SomethingWentWrongMsg);
    })
    .catch((error) => {
      console.log(error);
      typeof successCallback === 'function' && failureCallback(Constants.SomethingWentWrongMsg);
    });
};

const put = (props) => {
  
  let { url, body, successCallback, failureCallback, contentType, responseType, isNeedAutho = true } = props;
  let config = { headers: getRequestHeader('', isNeedAutho) };
  if (responseType) config.responseType = responseType;
  return axios
    .put(url, body, config)
    .then((response) => {
      if (response.status === 200) {
        if (response.data)
          typeof successCallback === 'function' && successCallback(response.data, response.data);
        else typeof failureCallback === 'function' && failureCallback(response.data.message);
      } else if (response.status === 401) CommonHelper.Logout();
      else typeof successCallback === 'function' && failureCallback(Constants.SomethingWentWrongMsg);
    })
    .catch((error) => {
      console.log(error);
      typeof successCallback === 'function' && failureCallback(Constants.SomethingWentWrongMsg);
    });
};

const del = (props) => {
  let { url, successCallback, failureCallback, isNeedAutho = true } = props;
  let config = { headers: getRequestHeader('', isNeedAutho) };
  return axios
    .delete(url, config)
    .then((response) => {
      if (response.status === 200) {
        if (response.data)
          typeof successCallback === 'function' && successCallback(response.data, response.data);
        else typeof failureCallback === 'function' && failureCallback(response.data.message);
      } else if (response.status === 401) CommonHelper.Logout();
      else typeof successCallback === 'function' && failureCallback(Constants.SomethingWentWrongMsg);
    })
    .catch((error) => {
      console.log(error);
      typeof successCallback === 'function' && failureCallback(Constants.SomethingWentWrongMsg);
    });
};


const HttpServices = {
  Post: post,
  Get: get,
  Put: put,
  Delete: del,
};

export default HttpServices;
