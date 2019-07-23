# Contributing

🎊 🎉 You're Awesome!! 🎉 🎊

Thank you for considering a contribution to our project.

## Installation

If you have never set up Jekyll or Ruby in your local environment, we recommend the Jekyll docs for [installing on your platform.](https://jekyllrb.com/docs/installation/)

We use the [latest stable Ruby version for development](https://github.com/hurricane-response/response-theme/blob/master/.ruby-version)

We also use [Gulp](https://gulpjs.com) for our build tool. Though Jekyll has support for Sass, we have opted to write plain CSS for 2019 browsers and let the tools backfill for compatibility. If you haven't worked with Gulp before, we recommend their [getting started docs](https://gulpjs.com/docs/en/getting-started/quick-start) which includes a link to [Node install steps](https://nodejs.org/en/)


Clone the repository

```{bash}
git clone https://github.com/hurricane-response/response-theme.git
```

navigate to the directory

```bash
cd response-theme
```

install the Jekyll dependencies

```bash
bundle install
```

install the Gulp dependencies

```bash
npm i
```

`Gulpfile` has two main tasks: `build` and `watch`

`build` does just that - builds the `_site` directory.

`watch` watches both `assets/css/_inc` directory to check for CSS changes as well as Jekyll file changes and rebuilds the appopriate files.

**A note about the CSS** All CSS is in the `_inc` directory is plain CSS. Current browser support for variables is strong, but we use PostCSS to fill in browser compatibility. PostCSS also compiles `assets/css/_inc/main.css` into `assets/css/main.css`. You should never need to edit `assets/css/main.css` file directly.

Reminder that this is a [Jekyll theme](https://jekyllrb.com/docs/themes/), not a stand alone site.

We optimized the build tools in this project with three goals:

* quick deploy.
* provide an out-of-the-box experience when using the theme as is.
* allow overriding `main.css` in the individual response site for event specific customizations.

## Where to start?

The [issues](https://github.com/hurricane-response/response-theme/issues). We ask that you create an issue before starting work on something, even if a new feature. We also ask that you adhere as best as possible to the issue template to help us better triage. Certainly small,minor typos do not require a novel, but the more information the better.

We have found that robust discussion before starting a new feature or large refactor has the greatest chance of success. Discussions can occur in the issue created or in Slack.


**Note** sometimes during an active response focus is on immediate needs and those of our partners. We respectfully ask that you use the issues and `@` one of the contributors.

### Whoa! I just want to fix a typo.

Yes! We understand that frustration. GitHub does a great job of providing an [in-browser experience for editing files](https://help.github.com/en/articles/editing-files-in-another-users-repository). If you don't have a GitHub account, first [create an account](https://github.com/join), then we ask you to create an issue for your suggested fix. Then navigate to the file with the minor change. In the upper right corner, next to the trash can symbol is a pencil. That icon will allow you to start the editing process. GitHub automagically will create a fork with your change and walk you through submitting it as a pull request.

![screencast of in browser pull requests](https://raw.githubusercontent.com/hurricane-response/response-theme/master/github_inbrowser_pullrequest.gif)

## Commit Messages

The message should be a short summary (max. 50 chars) written in the imperative, followed by an optional, more detailed explanatory text separated from the summary by an empty line.

Commit messages should follow best practices, including explaining the context of the problem and solution, including in caveats or follow up changes required. They should tell the story of the change and provide readers understanding of what led to it.

If you're lost about what this even means, please see [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) for a start.


## Pull Requests

All Pull Requests should have an accompanying issue and will require review before merging.

**Note During an active response, this policy can be fluid, as events on the ground change and fixes are often needed ASAP. During those times, we ask you get an explicit OK or instruction from a maintainer before creating a PR not tied to an issue.

Only maintainers can merge PRs, and only they can decide whether to waive or defer a review on a PR. As a rule, this doesn't happen often, and only does during an active response or major service outage.**

We ask that you follow the template for Pull Requests in the same manner as issues.

We also ask that if your PR no longer merges cleanly, use `rebase master` rather than `merge master`.

Include an issue reference like Closes #XXXX or Fixes #XXXX in commits that close an issue. Including references automatically closes the issue on a merge.

## Review

All Pull Requests require peer review before merging to master. Pull Requests should also pass all tests before consideration of merging unless there is a clear reason.

## Credits

Special thanks to the Moby project and their [Contributing Guidelines](for inspiration).
