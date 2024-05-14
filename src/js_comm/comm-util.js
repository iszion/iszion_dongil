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
};
