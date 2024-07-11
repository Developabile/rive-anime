# How to create the .env file

The .env file will be created based on .env.example  
The values to be filled are:

## 1. Firebase configuration

```.env
NEXT_PUBLIC_FB_API_KEY=
NEXT_PUBLIC_FB_AUTH_DOMAIN=
NEXT_PUBLIC_FB_PROJECT_ID=
NEXT_PUBLIC_FB_STORAGE_BUCKET=
NEXT_PUBLIC_FB_SENDER_ID=
NEXT_PUBLIC_FB_APP_ID=
NEXT_PUBLIC_FB_MEASUREMENT_ID=
```

Steps to get the credentials:

- Go to the [Firebase Console](https://console.firebase.google.com/).
- Create a new project or select an existing one.
- Navigate to Project Settings > General.
- Under Your apps, click on the Web app (</>) icon to register a new app.
- Copy the config object's values into your `.env` file.

## 2. Consumet API

```.env
  NEXT_PUBLIC_ANILIST_API=
```

Anilist : https://anilist.gitbook.io/anilist-apiv2-docs/overview/graphql/getting-started  
Consumet : https://github.com/consumet/api.consumet.org

You can use Anilist API, but here we have used consumet which is based on anilist

## 3. Video Streaming API

```.env
NEXT_PUBLIC_STREAM_URL_PRO=
```

These are all the different streaming services used, that can't be disclosed directly.  
But I can give you a hint..

> [!TIP]  
> We offer free streaming links for movies and episodes that can be  
> effortlessly integrated into your website through our embed links, API

You can do some research over internet using this quote to get the services.  
And if you are going to create your own website, then I would recommend to go through [github-issue](https://github.com/AdvithGopinath/LetMeWatch/issues/4).  
They have created a list of services, but some may have stopped working, still you will get working ones also.  
If you do some researching, then you will find the right services here.

## 4. Google Analytics

```.env
NEXT_PUBLIC_GT_MEASUREMENT_ID=
```

Add your Measurement ID from your Google Tag Manager/ Google Analytics, to track websites for Analytics purposes.  
We are usig Google Analytics with Google Tag Manager to track multiple deployments.  
This is optional, either add this env variable  
Or comment out these three lines _(line 14 , 19 & 111)_ in `./src/pages/_app.tsx`:

```js
import { GoogleAnalytics } from "@next/third-parties/google";

const GTag: any = process.env.NEXT_PUBLIC_GT_MEASUREMENT_ID;

<GoogleAnalytics gaId={GTag} />
```

Steps to generate Google Tag in GA:

1. Go to the Admin page in Google Analytics(GA)
2. Navigate to Data Streams
3. Select the Data Stream of your property
4. Select Configure Tag Settings
5. Click Configure your domains
6. Enter all the domains you want to track
7. Verify that the tag on each page uses the same tag ID from the same web data stream
8. Click Save

---

If there are anymore env vars left, give them any random values, as they were used in dev only and not in prod.

## **Disclaimer**

> [!IMPORTANT]
>
> Rive-Anime(RiveKun) does not host any files, it merely links to 3rd party services.  
> Legal issues should be taken up with the file hosts and providers.  
> Rive-Anime(RiveKun) is not responsible for any media files shown by the video providers.

Happy Coding :)
