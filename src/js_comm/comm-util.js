export default {
  formatDate(rawDate) {
    if (rawDate) {
      const year = rawDate.substring(0, 4);
      const month = rawDate.substring(4, 6);
      const day = rawDate.substring(6, 8);
      return `${year}-${month}-${day}`;
    } else {
      return null;
    }
  },

  reFormatDate(rawDate) {
    return rawDate ? rawDate.replace(/-/g, '') : null;
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
};
