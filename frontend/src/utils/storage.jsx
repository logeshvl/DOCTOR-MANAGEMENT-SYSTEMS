import { Crypto } from "../services/crypto.jsx";
import Cookies from "js-cookie";

const getItemFromCookies = (name) => {
    let cookieValue = Cookies.get(name);
    return cookieValue ? Crypto.decryption(cookieValue) : "";
}
const setItemToCookies = (name, content) => {
    Cookies.set(name, Crypto.encryption(content));
}
export const CookiesStorage = {
    setItem: setItemToCookies,
    getItem: getItemFromCookies
};