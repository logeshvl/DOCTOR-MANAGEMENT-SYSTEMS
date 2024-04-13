import axios from 'axios';
import { format } from 'date-fns';
import { CookiesStorage } from './storage';
import moment from "moment/moment";
import HttpServices from 'src/services/httpService';
import { userModuleURL } from 'src/services/urlService';
import Cookies from 'js-cookie';

const DateFormat = (date) => {
  return format(new Date(date), 'dd MMMM yyyy');
};
const CreateFileFromImageUrl = (imageUrl, fileName) => {
  return axios
    .get(imageUrl, {
      responseType: 'arraybuffer',
    })
    .then((response) => {
      return new File([response.data], fileName, { type: response.headers['content-type'] });
    });
};

const GetLoggedInUserDetailsFromCookies = () => {
  let user = null;
  let userDetails = CookiesStorage.getItem('user_details');
  let userInfo = userDetails && JSON.parse(userDetails);
  if (userInfo) user = userInfo;
  return user;
};

const ClearLocalStorage = () => {
  localStorage.clear();
  Cookies.remove('token');
  Cookies.remove('username');
  window.location.href = "/";
}

const Logout = () => {
  // let postProps = {
  //   url: userModuleURL.logout,
  //   body: null
  // }
  // HttpServices.Post(postProps);
  ClearLocalStorage();
}

export const GetLocalTimefromUTC = (timeString) => {
  return moment.utc(timeString).local();
};

export const GetDateFormat = (date) => {
  let dateString = "";
  let vDate = new Date(date).toString();
  if (vDate !== "Invalid Date")
    dateString = moment.utc(new Date(date)).local().format('LLL').toString();
  return dateString;
}

export const CommonHelper = {
  DateFormat,
  CreateFileFromImageUrl,
  GetLoggedInUserDetailsFromCookies,
  Logout,
  GetLocalTimefromUTC,
  GetDateFormat
};
