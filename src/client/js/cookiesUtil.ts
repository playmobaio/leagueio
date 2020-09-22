/*
 * General utils for managing cookies in Typescript.
 */
export function setCookie(name: string, val: string): void {
  const date = new Date();
  const value = val;

  // Set it expire in 30 days
  date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Set it
  document.cookie = `${name}=${value}; expires=${ date.toUTCString() }; path=/`;
}

export function getCookie(name: string): string {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");

  if (parts.length == 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}

export function deleteCookie(name: string): void {
  const date = new Date();

  // Set it expire in -1 days
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);

  // Set it
  document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
}

const playmobaUserName = "playmobUserName";

export function loadPlayMobaCookie(): void {
  const name = getCookie(playmobaUserName);
  if (name != null && name != "") {
    const nameInput = document.getElementById("playerName") as HTMLInputElement;
    nameInput.value = name;
  }
}

export function trySetPlayMobaCookie(name: string): void {
  const currentValue = getCookie(playmobaUserName);
  if (name != null && name != "" && name != currentValue) {
    setCookie(playmobaUserName, name);
  }
}