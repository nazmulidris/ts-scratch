interface Article {
  title: string;
  body: string;
}

function isArticle(param: any): param is Article {
  const myParam = param as Article;
  return (
    myParam.title != undefined &&
    myParam.body != undefined &&
    typeof myParam.title == "string" &&
    typeof myParam.body == "string"
  );
}

function doSomething(bar: unknown) {
  if (isArticle(bar)) {
    console.log("Article interface type: ", bar.title, bar.body);
  } else {
    console.log("unknown type", bar);
  }
}

doSomething({ title: "t", body: "b" });
doSomething({ foo: "t", bar: "b" });
