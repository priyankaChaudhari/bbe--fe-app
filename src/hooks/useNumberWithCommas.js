const useNumberWithCommas = (x, prefix = '', postfix = '', round = false) => {
  let result;
  if (x === undefined || x === null || isNaN(Number(x))) {
    result = 'N/A';
  } else {
    const tempNumer = round ? Math.round(x) : x;
    result =
      prefix +
      Number(tempNumer)
        .toFixed(2)
        .toString()
        .replace(/-/g, '') // Remove dash
        .replace(/\.0+$/, '') // Remove decimal zero
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + // Add comma seprator
      postfix;
  }

  return result;
};

export default useNumberWithCommas;
