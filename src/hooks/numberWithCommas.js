const useNumberWithCommas = (x, currency = '') => {
  if (x === undefined || x === null || isNaN(Number(x))) {
    return 'N/A';
  }
  return (
    currency +
    Number(x)
      .toFixed(2)
      .toString()
      .replace(/\.0+$/, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  );
};

export default useNumberWithCommas;
