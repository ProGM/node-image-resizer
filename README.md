Node Image Resizer
=====================

A simple stateless on-the-fly image resizer in node.js.


## How it works
Supposing you have a website where you store your images, say `assets.mysite.com`.

Add to the ENV variables your current image domain:

```
IMAGE_URL=http://assets.mysite.com
```

Then deploy this app, for instance, on `resizer.mysite.com`.

Now you can proxy image requests to the resizer, and they got magically resized!

For instance, if you have an image on `http://assets.mysite.com/my_folder/myimage.png`, you can call `http://resizer.mysite.com/300x300/my_folder/myimage.png` to obtain a 300x300 resized version!

You can also get the original image by calling `http://resizer.mysite.com/original/my_folder/myimage.png`

## CDN

This app does it's best when placed behind a CDN like `cloudflare` or `cloudfront`, since the resized image get cached by the CDN cache for one year.

## Deploy on Heroku

To deploy on heroku, you have to change the default buildpacks setup.

You can do it by using:
```bash
heroku buildpacks:add https://github.com/ddollar/heroku-buildpack-apt.git
heroku buildpacks:add https://github.com/ProGM/heroku-buildpack-nodejs
heroku buildpacks:remove heroku/nodejs
```

To check the correct setup run `heroku buildpacks`, you should see something like this:

```
=== your-app Buildpack URLs
1. https://github.com/ddollar/heroku-buildpack-apt.git
2. https://github.com/ProGM/heroku-buildpack-nodejs
```
