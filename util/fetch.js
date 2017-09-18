import fetch from 'node-fetch';

export const get = async (url) => {
  try {
    let response = await fetch(url);
    if(!response.ok) {
      console.log("Response not ok");
      console.log(response);
      throw new Error(response)
    }

    return await response.json();
  } catch(err) {
    console.log("Caught Error in Fetch util");
    throw Error(err);
  }
};