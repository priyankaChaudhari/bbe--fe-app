const numberWithCommas = (x) => {
  return Number(x)
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default numberWithCommas;
