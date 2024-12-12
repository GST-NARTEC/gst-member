// Using a simple encryption for example - you should use a more secure method in production
export const encrypt = (data) => {
  return btoa(JSON.stringify(data));
};

export const decrypt = (hash) => {
  try {
    return JSON.parse(atob(hash));
  } catch (error) {
    return null;
  }
};
