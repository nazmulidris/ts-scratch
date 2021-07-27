## CSS Handbook

Here are some tips and tricks used in this project.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Great CSS references](#great-css-references)
- [Import normalize.css](#import-normalizecss)
- [Difference between body and html (:root)](#difference-between-body-and-html-root)
- [Local vs global scope CSS variables (custom properties)](#local-vs-global-scope-css-variables-custom-properties)
- [Using CSS class pseudo selectors to style child elements of a parent](#using-css-class-pseudo-selectors-to-style-child-elements-of-a-parent)
- [CSS sizing](#css-sizing)
- [img vs CSS background-image](#img-vs-css-background-image)
- [CSS layouts](#css-layouts)
  - [Flow layout - inline or blocks (line breaks)](#flow-layout---inline-or-blocks-line-breaks)
  - [Flex layout](#flex-layout)
  - [Grid layout](#grid-layout)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Great CSS references

- [Codrops](https://tympanus.net/codrops/css_reference/)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
- [webgradients.com](https://webgradients.com)
- [colorhunt.com](https://www.colorhunt.co/)

### Import normalize.css

Here's the [github repo](https://github.com/necolas/normalize.css/) for Normalize.css. You can
either:

1. Download the CSS file and import it.
2. Import the CDN URLs (from the repo's README) which can be found
   [here](https://classic.yarnpkg.com/en/package/normalize.css). Using the
   [`unpkg`](https://unpkg.com/) CDN as an example,
   - Here's the link to v8.0.1: `https://unpkg.com/normalize.css@8.0.1/normalize.css`
   - Removing the `@8.0.1` ends up in the latest version of this file, so I am using
     `https://unpkg.com/normalize.css/normalize.css`
3. Or just get the latest version from the github repo itself:
   `https://necolas.github.io/normalize.css/latest/normalize.css`.

### Difference between body and html (:root)

`html` and `:root` are the same. There are subtle differences between them and `body`. One manifests
when we try to use `line-height` in `:root` / `html`. It simply does not work. But it does work when
applied to `body`. Here's some [vague indication](https://css-tricks.com/html-vs-body-in-css/) as to
why this might be happening.

So this does not work.

```css
:root {
  line-height: 1.5;
}

html {
  line-height: 1.5;
}
```

This does.

```css
body {
  line-height: 1.5;
}
```

### Local vs global scope CSS variables (custom properties)

CSS variables are actually called
[`custom properties`](https://tympanus.net/codrops/css_reference/custom-properties/). Usually they
are defined globally in `:root`. However, it possible to define them
[locally](https://css-tricks.com/breaking-css-custom-properties-out-of-root-might-be-a-good-idea). I
don't know if this is necessarily a good idea though. Here's an example.

```css
/* Use local variable, instead of decalaring in :root. */
a {
  --my-link-color: lightgray;
  color: var(--my-link-color);
}

yy a:link {
  --my-link-color: teal;
}

a:hover {
  --my-link-color: aquamarine;
}
```

### Using CSS class pseudo selectors to style child elements of a parent

Using CSS class pseudo selectors in order to style child elements of a parent (which has this style
applied) w/out having to manually assign classes to each of these children. Let's say that the
parent element has a class `DottedBox`, which will do this, here's the CSS. Here's a
[video](https://youtu.be/9e-lWQdO-DA) by Kevin Powell where he uses this pattern for flexbox.

1. `.DottedBox { padding: 8pt; border: 4pt dotted cornflowerblue; }`
2. `.DottedBox > * { /* this gets applied to all the children */ }`

### CSS sizing

The `box-sizing` rule determines whether padding and margin are included when calculating the width
and height of a "box" / element.

1. By default it is set to `box-sizing: content-box;` which accounts for the margin and padding.
2. You can set it to `box-sizing: border-box;` which ignores the padding and margin!

### img vs CSS background-image

Here's a great
[SO thread](https://stackoverflow.com/questions/492809/when-to-use-img-vs-css-background-image) on
this topic. To summarize:

- Use `img` tag when the image is part of the content (foreground).
- Use CSS `background-image` when:
  1. The image simply goes in the background of the content.
  2. The image should not be printed, if printing the "page" is a use case that needs to be
     considered.
  3. You need to overlay multiple images, gradients, other images, and apply transparency in layers
     to the background image, using
     [`background`](https://developer.mozilla.org/en-US/docs/Web/CSS/background) shorthand (here's
     an example [index.css](src/project-2/index.css)).

### CSS layouts

#### Flow layout - inline or blocks (line breaks)

The `display` rule determines whether an element is displayed in line or with a line break in a
[`CSS flow layout`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flow_Layout). By default
some elements are displayed inline (such as `button`). To change this you can specify.

1. `display: block;` doesn't make the element an inline element and adds a line break.
2. `display: inline;` makes the element an inline element and does not add a line break.

The `display` rule can also be used to switch to `flex` and `grid` layouts, which also affect the
positioning and sizing of their children elements.

#### Flex layout

#### Grid layout
