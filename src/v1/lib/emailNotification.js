// To: dms_upadates@wldd.in
// CC: dms_admin@wldd.in

let emailNotification = {
  pageCreationPostingReady: {
    audience: ["dms_upadates@wldd.in"],
  },
  pageInActive: {
    audience: ["dms_upadates@wldd.in"],
  },
  pageActive: {
    audience: ["dms_upadates@wldd.in"],
  },
  newCampaign: {
    audience: ["dms_campaign@wldd.in"],
  },
  campaignStageChange: {
    audience: ["dms_campaign@wldd.in"],
  },
  newBundleCreated: {
    audience: ["dms_campign@wldd.in"],
  },
};

let head = `<!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>`;

let footer = `<br/>Please visit the page and start using it for relevant campaigns.<br/><br/>
  Regards,
  <br/>
  Team - DMS
  <br/>
    </body>
    </html>`;

let url = `https://dms.wldd.in/`;

exports.pageCreationPostingReady = (platform, pageName, pageLink, entityId) => {
  let subject;
  let body;

  subject = `New Page ${platform} - ${pageName}`;
  body = `${head}
    <body>
    <p>Hi All,
    <br/> 
    A New page has been added to the DMS system and ready for Posting.</p>

    <br/>
    <b>Platform</b> - ${platform}<br/>
    <b>Page Name</b> - ${pageName}<br/>
    <b>Page Link</b> - ${pageLink}<br/>
    <b>DMS Link</b> - ${url}app/edit/${entityId}<br/>
    ${footer}`;

  return {
    subject,
    body,
    audience: emailNotification.pageCreationPostingReady.audience,
  };
};

exports.pageInActive = (pageLink, pageName, platform, poc) => {
  let subject;
  let body;

  subject = `${pageName} is Inactive`;
  body = `${head}
        <body>
       <p> Hi All,<br/> Below Page is no longer available for Posting.</p>
        Platform - <b>${platform}</b><br/>
        Page Link -<b> ${pageLink}</b><br/>
        POC -  <b> ${poc}</b><br/>
        ${footer}`;

  return {
    subject,
    body,
    audience: emailNotification.pageInActive.audience,
  };
};

exports.pageActive = (pageLink, pageName, platform, poc) => {
  let subject;
  let body;

  subject = `${pageName} is Active`;
  body = `${head}
            <body>
            <p>Hi All,<br/> Below Page is now active and ready for Posting.</p>
            Platform -<b> ${platform}</b><br/>
            Page Link - <b>${pageLink}</b><br/>
            POC -  <b> ${poc} </b><br/>
            ${footer}`;

  return {
    subject,
    body,
    audience: emailNotification.pageActive.audience,
  };
};

exports.newCampaign = (
  campaignName,
  clientName,
  stage,
  campaignLead,
  contentLead,
  distributionLead,
  id
) => {
  let subject;
  let body;

  subject = `${clientName} - ${campaignName} - ${stage}`;
  body = `${head}
     <body>
        <p>Hi All,<br/> We have a New Campaign ${campaignName} for ${clientName} is now ${stage}</p>
          <br/>
          <br/>
          <br/>
          Campaign Lead - <b>${campaignLead}</b><br/>
          Content Lead - <b>${contentLead}</b><br/>
          Distribution Lead - <b>${distributionLead}</b><br/>
          Link to Campaign - <b>${url}app/edit-campaign/${id}</b><br/>
     ${footer}`;

  return {
    subject,
    body,
    audience: emailNotification.newCampaign.audience,
  };
};

exports.campaignStageChange = (
  campaignName,
  clientName,
  stage,
  campaignLead,
  contentLead,
  distributionLead,
  id
) => {
  let subject;
  let body;

  subject = `${clientName} - ${campaignName} - is now ${stage} stage`;
  body = `${head}
            <body>
                <p>Hi All,<br/> We have a New Campaign ${campaignName} for ${clientName} is now ${stage}</p>
                    <br/>
                    <br/>
                    <br/>
                    Campaign Lead - <b>${campaignLead}</b><br/>
                    Content Lead - <b>${contentLead}</b><br/>
                    Distribution Lead - <b>${distributionLead}</b><br/>
                    Link to Campaign - <b>${url}app/edit-campaign/${id}</b><br/>
                ${footer}`;

  return {
    subject,
    body,
    audience: emailNotification.campaignStageChange.audience,
  };
};

exports.newBundleCreated = (bundleName, platform) => {
  let subject;
  let body;
  subject = `${bundleName} for ${platform} is Created`;
  body = `${head}
          <body>
              Hi Team,<br/>
              <p>A new bundle is available for ${platform} platform. Details Below.</p><br/>
              Bundle Name - <b>${bundleName}</b><br/>

              For more details check the page on DMS. ${url}</br> 
           
              ${footer}`;

  return {
    subject,
    body,
    audience: emailNotification.newBundleCreated.audience,
  };
};
