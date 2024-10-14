export const sendNotification = (fcmToken, userName, data ,userId) => {
  // console.log("notification data ", "fcmtoken:", fcmToken, "userName:", userName, "data", data);
  let eventData = {};
  const url = "https://fcm.googleapis.com/fcm/send";
  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "key=AAAA_4Uj44k:APA91bHy5axJKPvZe1lR074cGDf9kNUyB5Q-kB8dh3NK9DApYqNm5rD2Pi6Rn1roBsPig78HK75NvIkyyOL5fagwQlqWtb5nEmsckIUwVIlLbZGwS8osYFQfuM5NirkQAcuKGB_AtteN",
  };

  eventData = {
    to: fcmToken,
    collapse_key: "type_a",
    notification: {
      body: `Please help ${userName}  `,
      title: "help Alert ",
    },
    data: {
      body: "Body of Your Notification in Data",
      title: "Title of Your Notification in Title",
      lat: data?.latitude,
      lng: data?.longitude,
      userId: userId,
      workerPhoneNumber:data?.workerPhoneNumber,
      type:"track"
    },
  };
  fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(eventData),
  }).then((res) => {
    console.log("noti res", res);
    if (res.ok) {
      // alert("notification has been sent ");
      return;
    }
  });
};
