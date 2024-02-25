
Generate image using browser canvas by data from **Data URL**. Just static files ( 1 index.html and .js files ).

# Usage

Just visit the index.html with ```?d={ DATA URL }```. [See Example →](https://hal-f.cn/lab/dyposter?https://hal-f.cn/lab/dyposter/example.json)

The **DATA URL** should accept GET request properly and return a **Dyposter Object** to be drawed.


# Dyposter Object

Dyposter use fabricjs to do canvas works, see to document: [http://fabricjs.com/](http://fabricjs.com/)

> For current version, objects only support types 'textbox' and 'image'.

```js
// The DATA URL should response json like this:
{
  "config": {
    "width": 1125,
    "height": 1800,
    "backgroundColor": "#22d3ee"
    // ... fabric.Canvas options
    },
  "objects": [
    { "type": "image",
      "mode": "cover",
      "top": 1500, "left": 825, "width": 300, "height": 300,
      "crossOrigin": "anonymous",
      "src": "https://th.bing.com/th?q=Red+Emoji&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=2&pid=InlineBlock&mkt=en-US&cc=US&setlang=en&adlt=moderate&t=1&mw=247"
      // ... fabric.Image options
    }
    {
      "type": "textbox",
      "text": "No Data Url",
      "fontFamily":"Arial",
      "top": 300, "left": 0, "width": 1125, "fontSize": 120, "fontWeight": 400,
      "textAlign":"center",
      "splitByGrapheme": true,
      // ... fabric.Canvas options
    },
    {
      "type": "textbox",
      "text": "https://xxx.com/dyposter?d=[Data Url]",
      "fontFamily":"Arial",
      "top": 600, "left": 100, "width": 925, "fontSize": 60, "fontWeight": 400,
      "textAlign":"left",
      "splitByGrapheme": true,
      // ... fabric.Textbox options
    },
    {
      "type": "textbox",
      "text": "The [Data Url] is an url accept GET request publicly and return a [Config Object], which will be drawed.",
      "fontFamily":"Arial",
      "top": 900, "left": 100, "width": 925, "fontSize": 60, "fontWeight": 400,
      "textAlign":"left",
      // ... fabric.Textbox options
    },
  ]
}

```

# Credit

- [fabricjs](https://github.com/fabricjs/fabric.js)
- [zepto.js](https://zeptojs.com/)

