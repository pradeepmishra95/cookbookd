const PROTOCOL = 'https';
const DOMAIN = 'cookbookd.mtesthub.in';
const SUFFIX = 'api';

const getBaseURL = () => {
  return `${PROTOCOL}://${DOMAIN}/${SUFFIX}`;
};

export {getBaseURL};

