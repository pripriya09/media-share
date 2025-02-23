## 3. Retrieving Facebook Page ID
To retrieve the Facebook Page ID linked to your Facebook account, make the following API call using your access token:
api- GET /me/accounts?fields=id,name,access_token,
 and in User or page dropdown select -Get User Access Token, in meta graph api explorer and select you app to   

result:   

{
  "data": [
    {
      "id": "you page-id",
      "name": "your page name 1",
      "access_token": "user access token "
    },
    {
        "id": "you page-id",
      "name": "your page name 2",
      "access_token": "user access token "
    }
  ],
  "paging": {
    "cursors": {
      "before": "QVFIUlZAOV01ZAMGVuSkFRYmFTWS1mVzkybFU1VmVXQmNPUEU4MnlvQmtKSURidnplUDhKc3c1WnNXX3lSTi1XblhpSV9WMmhKVnBERGFHSElnQkV3ZA2E2NGRB",
      "after": "QVFIUnhlZAmQyMVRsQXdDZAHd3cDdqNWNGZA192aXhwVmh5QlhGMnB2R09JSnJFaDVBY0MwVnNvU0NjTFJPeW5sM1o1blZAwV1dNTndyMFNVNFMydExBczJsOHZAn"
    }
  }
}


## 4. Retrieving Instagram Business Account
Once you have the **Page ID** and the **Page Access Token**, use this API call to retrieve the Instagram business account linked to your page:
api- GET /{page-id}?fields=instagram_business_account

Replace `{page-id}` with the actual ID of your Facebook page.

## 5. Response Handling
You’ll receive a response like:
```json
{
  "instagram_business_account": {
    "id": "instagram_account_id"
  }
}
If no Instagram account is linked, you’ll see an empty response.

// 6. Troubleshooting
// If you get No Instagram business account linked, ensure that your Instagram is a Business Account and is properly connected to a Facebook Page