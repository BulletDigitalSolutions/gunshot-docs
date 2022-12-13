const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Gunshot',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#e14343' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Gunshot',
        link: '/gunshot/',
      },
      {
        text: 'Gunshot-UI',
        link: '/gunshot-ui/'
      },
      {
        text: 'Doctrine-Eloquent',
        link: '/doctrine-eloquent/'
      },
      {
        text: 'Doctrine-Cashier',
        link: '/doctrine-cashier/'
      },
    ],
    sidebar: {
      '/gunshot/': [
        {
          title: 'Gunshot',
          collapsable: false,
          children: [
            '',
            'installation',
            'module-maker',
            'pivot-repositories',
            'image-resizer',
            'filter-string',
            'traits',
            'middleware',
          ]
        }
      ],
      '/gunshot-ui/': [
        {
          title: 'Gunshot-UI',
          collapsable: false,
          children: [
            '',
            'layout',
            'forms',
            'table',
          ]
        }
      ],
      '/doctrine-eloquent/': [
        {
          title: 'Doctrine-Eloquent',
          collapsable: false,
          children: [
            '',
          ]
        }
      ],
      '/doctrine-cashier/': [
        {
          title: 'Doctrine-Eloquent',
          collapsable: false,
          children: [
            '',
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
