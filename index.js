var htmlTags =
'circle clipPath defs ellipse g line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr'.split(' ');

module.exports = function (babel) {
  var t = babel.types;

  function console_(method, arguments) {
    return t.expressionStatement(t.callExpression(
      t.memberExpression(
        t.identifier('console'),
        t.identifier(method)),
      arguments));
  }

  function consoleAssertNotUndefined(name) {

    return consoleStatement = console_('assert',
      [t.identifier(name), t.literal(name + ' is undefined.')]);

  }


  return new babel.Plugin("assert-react-element-defined", {

    visitor: {
      JSXElement: function (node, parent) {

        var elementName = node.openingElement.name.name;
        if (htmlTags.indexOf(elementName) > -1) {
          return
        }

        var returnStatement = this;
        while (1) {
          returnStatement = returnStatement.parentPath;
          // ExpressionStatement: React.render() in entry.jsx
          // ReturnStatement: in render methods
          if (returnStatement.type === 'ReturnStatement' || returnStatement.type === 'ExpressionStatement') {
            break;
          }
        }
        returnStatement.insertBefore(consoleAssertNotUndefined(elementName));
      }
    }
  });
};

