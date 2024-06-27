export default {
  formatDate(rawDate) {
    if (rawDate) {
      return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6)}`;
    } else {
      return '';
    }
  },

  unFormatDate(rawDate) {
    return rawDate ? rawDate.replace(/-/g, '') : '';
  },

  formatTime(rawTime) {
    if (rawTime) {
      return `${rawTime.slice(0, 2)}:${rawTime.slice(2, 4)}:${rawTime.slice(4)}`;
    } else {
      return '';
    }
  },

  unFormatTime(rawTime) {
    return rawTime ? rawTime.replace(/-/g, '') : '';
  },

  removeComma(value) {
    if (typeof value !== 'string') {
      // handle non-string values, maybe throw an error or return default value
      return value;
    }
    return value.replace(',', '');
  },

  getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  getTodayYear() {
    const today = new Date();
    return today.getFullYear();
  },
  getTodayMonth() {
    const today = new Date();
    return String(today.getMonth() + 1).padStart(2, '0');
  },
  getTodayDay() {
    const today = new Date();
    return String(today.getDate()).padStart(2, '0');
  },

  getLastMonthDay(year, month) {
    return new Date(year, month + 1, 0).getDate();
  },

  getDateWithZero(date) {
    // Convert the date to a string and use padStart to ensure it has at least 2 digits
    return date.toString().padStart(2, '0');
  },

  formatDatetime(datetime) {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  textByteLength(str) {
    let strLength1 = 0;
    let strLength2 = 0;
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    const matches1 = str.match(koreanRegex);
    const generalRegex = /[^\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/g;
    const matches2 = str.match(generalRegex);
    if (matches1) {
      strLength1 = matches1.length * 2;
    }
    if (matches2) {
      strLength2 = matches2.length;
    }
    // console.log('matches1 : ', matches1);
    // console.log('matches2 : ', matches2);
    return strLength1 + strLength2;
  },
};
