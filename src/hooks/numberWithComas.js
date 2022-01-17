const numberWithCommas = (x) => {
  return Number(x)
    .toFixed(2)
    .toString()
    .replace(/\.0+$/, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default numberWithCommas;
