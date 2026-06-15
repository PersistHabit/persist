import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    '_layout': ExtractProps<(typeof import('../../inertia/pages/_layout.tsx'))['default']>
    'agenda': ExtractProps<(typeof import('../../inertia/pages/agenda.tsx'))['default']>
    'auth/_layout': ExtractProps<(typeof import('../../inertia/pages/auth/_layout.tsx'))['default']>
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/register': ExtractProps<(typeof import('../../inertia/pages/auth/register.tsx'))['default']>
    'counters': ExtractProps<(typeof import('../../inertia/pages/counters.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'journal': ExtractProps<(typeof import('../../inertia/pages/journal.tsx'))['default']>
    'shopping': ExtractProps<(typeof import('../../inertia/pages/shopping.tsx'))['default']>
    'stats': ExtractProps<(typeof import('../../inertia/pages/stats.tsx'))['default']>
    'today': ExtractProps<(typeof import('../../inertia/pages/today.tsx'))['default']>
  }
}
