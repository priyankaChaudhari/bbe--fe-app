const useFormatNumber = (
  x,
  prefix = '',
  postfix = '',
  round = false,
  showPositiveSign = false,
) => {
  let result;
  if (x === undefined || x === null || isNaN(Number(x))) {
    result = 'N/A';
  } else {
    const finalNumber = round ? Math.round(x) : x;
    const finalPrefix =
      finalNumber < 0 ? `-${prefix}` : showPositiveSign ? `+${prefix}` : prefix;
    result =
      finalPrefix +
      Number(finalNumber)
        .toFixed(2)
        .toString()
        .replace(/-/g, '') // Remove dash
        .replace(/\.0+$/, '') // Remove decimal zero
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + // Add comma seprator
      postfix;
  }

  return result;
};

export default useFormatNumber;
