module.exports = (userName, password) => {
  let url;
  if (process.env.NODE_ENV.trim() === "dev") {
    url = `https://dmsdev.wldd.in`;
  } else {
    url = `https://dms.wldd.in`;
  }
  const text = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
        <h2>Welcome to WLDD Team </h2>
        Your user name and password are <br>
        <b>UserName </b>: ${userName} <br>
        <b>Password </b>: ${password}<br>
        Login here <a href = ${url}>WLDD DMS</a>
    </body>
  </html>`;
  return text;
};

// DEV:
// http://dmsdevapi.wldd.in/ - backend
// http://dmsdev.wldd.in/ - frontend
// PROD:
// http://dmsapi.wldd.in/ - backend
// http://dms.wldd.in/ - frontend
