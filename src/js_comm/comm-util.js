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
};
