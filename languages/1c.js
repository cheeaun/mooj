hljs.IDENT_RE_RU = '[a-zA-Zа-яА-Я][a-zA-Z0-9_а-яА-Я]*';
hljs.OneS_KEYWORDS = {'процедура':1,'функция':1,'экспорт':1,'перем':1,'конецфункции':1,'конецпроцедуры':1,'если':1,'тогда':1,'иначе':1,'иначеесли':1,'конецесли':1,'попытка':1,'исключение':1,'конецпопытки':1,'ложь':1,'истина':1,'неопределено':1,'и':1,'или':1,'не':1,'null':1,'для':1,'каждого':1,'из':1,'по':1,'цикл':1,'конеццикла':1};

hljs.LANGUAGES['1c'] = {
  defaultMode: {
    lexems: [hljs.IDENT_RE_RU],
    contains: ['comment', 'string', 'function', 'preprocessor', 'number'],
    keywords: hljs.OneS_KEYWORDS
  },
  case_insensitive: true,
  modes: [
    hljs.C_LINE_COMMENT_MODE,
    {
      className: 'string',
      begin: '"', end: '"',
      contains: ['dquote'],
      relevance: 0
    },
    {
      className: 'string',
      begin: '"', end: '$',
      contains: ['dquote']
    },
    {
      className: 'string',
      begin: '\\|', end: '$',
      contains: ['dquote']
    },
    {
      className: 'string',
      begin: '\\|', end: '"',
      contains: ['dquote']
    },
    {
      className: 'dquote',
      begin: '""', end: '^'
    },
    {
      className: 'number',
      begin: hljs.NUMBER_RE, end: '^',
      relevance: 0
    },
    {
      className: 'title',
      lexems: [hljs.IDENT_RE_RU],
      begin: hljs.IDENT_RE_RU, end: '^'
    },
    {
      className: 'params',
      begin: '\\(', end: '\\)',
      lexems: [hljs.IDENT_RE_RU],
      keywords: {'знач':1},
      contains: ['string']
    },
    {
      className: 'function',
      begin: '(процедура|функция)', end: '$',
      lexems: [hljs.IDENT_RE_RU],
      keywords: {'процедура': 1, 'экспорт':1, 'функция': 1},
      contains: ['title','tail','comment'],      
      relevance: 0
    },
    {
      className: 'tail',
      begin: '^',  endsWithParent: true,
      lexems: [hljs.IDENT_RE_RU],
      contains: ['params', 'export']
    },
    {
      className: 'export',
      begin: 'экспорт', endsWithParent: true, 
      lexems: [hljs.IDENT_RE_RU],
      keywords: {'экспорт': 1},
      contains: ['comment']
    },
    {
      className: 'preprocessor',
      begin: '#', end: '$',
      lexems: [hljs.IDENT_RE_RU]
    }
  ]
};
