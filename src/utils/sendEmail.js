const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (
  toAddress,
  fromAddress,
  subject,
  body
) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },

    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },

        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },

      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },

    Source: fromAddress,
  });
};

const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    "sg9956855@gmail.com", // receiver
    "gshruu.123@gmail.com", // verified sender
    subject,
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = { run };