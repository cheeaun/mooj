/*

Bash Scripts by vah <vahtenberg@gmail.com>

*/
hljs.BASH_LITERAL = {'true' : 1, 'false' : 1}
hljs.LANGUAGES.bash = {
  defaultMode: {
    lexems: [hljs.IDENT_RE],
    contains: ['string', 'shebang', 'comment', 'number', 'test_condition', 'string', 'variable'],
    keywords: {
      'keyword': {'if' : 1, 'then' : 1, 'else' : 1, 'fi' : 1, 'for' : 1, 'break' : 1, 'continue' : 1, 'while' : 1, 'in' : 1, 'do' : 1, 'done' : 1, 'echo' : 1, 'exit' : 1, 'return' : 1, 'set' : 1, 'declare' : 1},
      'literal': hljs.BASH_LITERAL
    }
  },
  case_insensitive: false,
  modes: [
    {
      className: 'shebang',
      begin: '(#!\\/bin\\/bash)|(#!\\/bin\\/sh)', 
      end: '^',
      relevance: 10
    },
    hljs.HASH_COMMENT_MODE,
    {
      className: 'test_condition',
      begin: '\\[ ', 
      end: ' \\]',
      contains: ['string', 'variable', 'number'],
      lexems: [hljs.IDENT_RE],
      keywords: {
        'literal': hljs.BASH_LITERAL
      },
      relevance: 0
    },
    {
      className: 'test_condition',
      begin: '\\[\\[ ', 
      end: ' \\]\\]',
      contains: ['string', 'variable', 'number'],
      lexems: [hljs.IDENT_RE],
      keywords: {
        'literal': hljs.BASH_LITERAL
      }
    },
    {
      className: 'variable',
      begin: '\\$([a-zA-Z0-9_]+)\\b', 
      end: '^'
    },
    {
      className: 'variable',
      begin: '\\$\\{(([^}])|(\\\\}))+\\}', 
      end: '^',
      contains: ['number']
    },
    {
      className: 'string',
      begin: '"', end: '"',
      illegal: '\\n',
      contains: ['escape', 'variable'],
      relevance: 0
    },
    {
      className: 'string',
      begin: '"', end: '"',
      illegal: '\\n',
      contains: ['escape', 'variable'],
      relevance: 0
    },
    hljs.BACKSLASH_ESCAPE,
    hljs.C_NUMBER_MODE,
    {
      className: 'comment',
      begin: '\\/\\/', end: '$',
      illegal: '.'
    }
  ]
};

