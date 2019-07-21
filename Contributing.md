# Contributing

🎊 🎉 You're Awesome!! 🎉 🎊

Thank you for considering a contribution to our project.

## Installation

If you have never set up Jekyll or Ruby in your local environment, we recommend the Jekyll docs for [installing on your platform.](https://jekyllrb.com/docs/installation/)

We use the [latest stable Ruby version for development](https://github.com/hurricane-response/response-theme/blob/master/.ruby-version)

We also use [Gulp](https://gulpjs.com) for our build tool. Though Jekyll has support for Sass, we have opted to write plain CSS for 2019 browsers and let the tools backfill for compatibility. If you haven't worked with Gulp before, we recommend their [getting started docs](https://gulpjs.com/docs/en/getting-started/quick-start) which includes a link to [Node install steps](https://nodejs.org/en/)


Clone the repository

```
git clone git@github.com:hurricane-response/response-theme.git
```

navigate to the directory

```
cd response-theme
```

install the Jekyll dependencies

```
bundle install
```

install the Gulp dependencies

```
npm i
```

Gulp files has two main tasks: `build` and `watch`

`build` does just that - builds the `_site` directory.

`watch` watches both `assets/css/_inc` directory to check for CSS changes as well as Jekyll file changes and rebuilds the appopriate files.

**A note about the CSS** All CSS is in the `_inc` directory as plain CSS. Current browser support for variables is strong, but we use PostCSS to fill in browser compatibility. PostCSS also compiles `assets/css/_inc/main.css` into `assets/css/main.css`. You should never need to edit `assets/css/main.css` file directly.

Reminder that this is a [Jekyll theme](https://jekyllrb.com/docs/themes/), not a stand alone site. We optimized the build tools to both allow customization by the individual response sites by overriding `main.css` locally as well as is.

