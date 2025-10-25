# Gist🔗🌲

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Test](https://github.com/GreatWizard/gistlinktree/actions/workflows/test.yml/badge.svg)](https://github.com/GreatWizard/gistlinktree/actions/workflows/test.yml)

Generate a link tree from a configuration file.

## Installation

```shell
npm install --save gistlinktree
```

## Usage

```shell
npx gistlinktree [options]
```

### Options

```shell
  -c, --config string       Path to the config file
  -o, --output-dir string   Output directory
  -h, --help                Print this usage guide
```

Config file is defaulted to `gistlinktree.yml`.

Output directory is defaulted to `dist`.

## Configuration

Define a `gistlinktree.yml` file as following:

```yaml
title: My Personal Link Tree # Main title of your page
avatar: static/avatar.jpg # avatar used in priority over gravatar
gravatar: <md5-hash-of-your-email-here> # load avatar from gravatar
theme: dracula # theme of the stylesheet; values: default, dracula, mitclan
index:
  copy: # copy file at the root directory without changing the name
    - input: static/icons/favicon.ico
    - input: static/CNAME
links:
  - outputDir: my-tiny-static-website # build the gist into a subfolder
    gistID: <id-of-the-gist-here> # you need to specify the if of your gist
    copy:
      - input: static/icons/website.ico # file to copy
        output: favicon.ico # rename the file
  - title: Github.com # title of the button link
    url: https://github.com # define the URL of the link
linksSocialPosition: bottom # position of the social links in the page; values: bottom (by default), top
linksSocial:
  - type: github # icon of the social link (use Font Awesome solid and brand icon names)
    url: https://github.com/<my-nickname> # define the URL of the social link
```

ℹ️ SASS/SCSS/CSS files added in the `index.copy` list are added automatically into the generated `index.html`.

### Format conversion

During the copy process or the build process of a gist, it converts:

- markdown files into HTML
- SASS/SCSS files into CSS

### Social Links

Only solid and brand icons coming from Font Awesome v7.1 are available: https://fontawesome.com/v7.1/icons?d=gallery&p=2&s=brands,solid&m=free
