# Code For America Disaster Response Hub

**Description**:  A quick response web hub for disaster response and sharing maps and data from [Shelter & POD API](https://github.com/hurricane-response/florence-api)

**Status**: In development, deployed for 2019 hurricane season.

## Installation

This site is a static [Jekyll](https://jekyllrb.com/) site served on [GitHub Pages](https://pages.github.com/).

See the Jekyll docs for [local installation](https://jekyllrb.com/docs/installation/)




![Default site screenshot.](https://raw.githubusercontent.com/hurricane-response/florence_website/master/screenshot.png )

## Configuration

Site variables can be overriden in the `_config.yml` on the response site. We will have a separate response site template repository we will document the configuation setting overrides.

## Known issues

See our [open issues](https://github.com/hurricane-response/michael_website/issues)

**Note:** Mapbox donates their product to us for free for volunteer projects only -- if the project ends up getting adopted by a government partner or somehow turns into a commercial project, we'll have to plan a transition to a different Mapbox account.

## FAQ

### Why Jekyll and GitHub?

We wanted a site up fast, the volunteer team that started working on Hurricane Florence knew Jekyll, and we wouldn't have to worry about hosting and infrastructure. As we moved away from an iframed React app running code and on a domain we didn't control, we moved to fully using Jekyll and Mapbox.

### Why a Jekyll Theme?

The problem we are trying to solve with a gem based theme is prevent duplicate work and expidite the process to lauch a new response site. After Florence we realized we were having to copy files over to a new repository so we could customize the name and map center among other reasons. Any new work added to a new site wouldn't get added to an existing response site. Not to mention, there wasn't any continuity in tracking issues or properly crediting contributions.

Jekyll introduced [gem based themes](https://jekyllrb.com/docs/themes/) in 3.5. Subsequently around 3.6.2 release Ben Balter [released a plugin](https://github.com/benbalter/jekyll-remote-theme) that allows GitHub Pages hosted sites to use any gem based theme that was public on GitHub. The idea is, if we keep the presentational markup and base map code in a theme repository that each response site can use by overriding variables in the `_config.yml` file, it would be quick and easy to deploy a new response site while keeping all the code/issues/contributions in a single repository.

## Getting involved

Our [getting started](https://docs.google.com/document/d/1f_ODFvGzrOihfkckSxJ8hU4d9I3b389Rx4aAEFEHvTw/edit?usp=sharing) document serves as the best entry for the project for all types of contributions.

## Open source licensing info
1. [LICENSE](LICENSE)
2. [Code of Conduct](Code_of_Conduct.md)


----

## Credits and references

Built off of previous hurricane responses  [Florence](https://github.com/hurricane-response/florence_website),  & [Michael](https://github.com/hurricane-response/michael_website)