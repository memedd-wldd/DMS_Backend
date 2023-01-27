module.exports = (otp) => {
    const text = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
           Your OTP Pin for WLDD is ${otp}, It is valid till one hour.
      </body>
    </html>`;
    return text;
  };
  