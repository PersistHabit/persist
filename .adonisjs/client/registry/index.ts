/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'agenda.index': {
    methods: ["GET","HEAD"],
    pattern: '/agenda',
    tokens: [{"old":"/agenda","type":0,"val":"agenda","end":""}],
    types: placeholder as Registry['agenda.index']['types'],
  },
  'agenda.store': {
    methods: ["POST"],
    pattern: '/agenda',
    tokens: [{"old":"/agenda","type":0,"val":"agenda","end":""}],
    types: placeholder as Registry['agenda.store']['types'],
  },
  'agenda.update': {
    methods: ["PUT"],
    pattern: '/agenda/:eventId',
    tokens: [{"old":"/agenda/:eventId","type":0,"val":"agenda","end":""},{"old":"/agenda/:eventId","type":1,"val":"eventId","end":""}],
    types: placeholder as Registry['agenda.update']['types'],
  },
  'agenda.destroy': {
    methods: ["DELETE"],
    pattern: '/agenda/:eventId',
    tokens: [{"old":"/agenda/:eventId","type":0,"val":"agenda","end":""},{"old":"/agenda/:eventId","type":1,"val":"eventId","end":""}],
    types: placeholder as Registry['agenda.destroy']['types'],
  },
  'agenda.pauses.store': {
    methods: ["POST"],
    pattern: '/agenda/:eventId/pauses',
    tokens: [{"old":"/agenda/:eventId/pauses","type":0,"val":"agenda","end":""},{"old":"/agenda/:eventId/pauses","type":1,"val":"eventId","end":""},{"old":"/agenda/:eventId/pauses","type":0,"val":"pauses","end":""}],
    types: placeholder as Registry['agenda.pauses.store']['types'],
  },
  'agenda.pauses.destroy': {
    methods: ["DELETE"],
    pattern: '/agenda/:eventId/pauses/:pauseId',
    tokens: [{"old":"/agenda/:eventId/pauses/:pauseId","type":0,"val":"agenda","end":""},{"old":"/agenda/:eventId/pauses/:pauseId","type":1,"val":"eventId","end":""},{"old":"/agenda/:eventId/pauses/:pauseId","type":0,"val":"pauses","end":""},{"old":"/agenda/:eventId/pauses/:pauseId","type":1,"val":"pauseId","end":""}],
    types: placeholder as Registry['agenda.pauses.destroy']['types'],
  },
  'today.index': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['today.index']['types'],
  },
  'today.completions.store': {
    methods: ["POST"],
    pattern: '/agenda-items/:itemId/completions',
    tokens: [{"old":"/agenda-items/:itemId/completions","type":0,"val":"agenda-items","end":""},{"old":"/agenda-items/:itemId/completions","type":1,"val":"itemId","end":""},{"old":"/agenda-items/:itemId/completions","type":0,"val":"completions","end":""}],
    types: placeholder as Registry['today.completions.store']['types'],
  },
  'today.completions.destroy': {
    methods: ["DELETE"],
    pattern: '/agenda-items/:itemId/completions/:completionId',
    tokens: [{"old":"/agenda-items/:itemId/completions/:completionId","type":0,"val":"agenda-items","end":""},{"old":"/agenda-items/:itemId/completions/:completionId","type":1,"val":"itemId","end":""},{"old":"/agenda-items/:itemId/completions/:completionId","type":0,"val":"completions","end":""},{"old":"/agenda-items/:itemId/completions/:completionId","type":1,"val":"completionId","end":""}],
    types: placeholder as Registry['today.completions.destroy']['types'],
  },
  'journal.index': {
    methods: ["GET","HEAD"],
    pattern: '/journal',
    tokens: [{"old":"/journal","type":0,"val":"journal","end":""}],
    types: placeholder as Registry['journal.index']['types'],
  },
  'journal.store': {
    methods: ["POST"],
    pattern: '/journal',
    tokens: [{"old":"/journal","type":0,"val":"journal","end":""}],
    types: placeholder as Registry['journal.store']['types'],
  },
  'page.login': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['page.login']['types'],
  },
  'page.register': {
    methods: ["GET","HEAD"],
    pattern: '/register',
    tokens: [{"old":"/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['page.register']['types'],
  },
  'auth.login': {
    methods: ["POST"],
    pattern: '/auth/login',
    tokens: [{"old":"/auth/login","type":0,"val":"auth","end":""},{"old":"/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.register': {
    methods: ["POST"],
    pattern: '/auth/register',
    tokens: [{"old":"/auth/register","type":0,"val":"auth","end":""},{"old":"/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.register']['types'],
  },
  'session.logout': {
    methods: ["DELETE"],
    pattern: '/auth',
    tokens: [{"old":"/auth","type":0,"val":"auth","end":""}],
    types: placeholder as Registry['session.logout']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
