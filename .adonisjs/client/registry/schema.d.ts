/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'agenda.index': {
    methods: ["GET","HEAD"]
    pattern: '/agenda'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/agenda_controller').default['index']>>>
    }
  }
  'agenda.store': {
    methods: ["POST"]
    pattern: '/agenda'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/agenda').agendaEventValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/agenda').agendaEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/agenda_controller').default['store']>>>
    }
  }
  'agenda.update': {
    methods: ["PUT"]
    pattern: '/agenda/:eventId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/agenda').agendaEventValidator)>>
      paramsTuple: [ParamValue]
      params: { eventId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/agenda').agendaEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/agenda_controller').default['update']>>>
    }
  }
  'agenda.destroy': {
    methods: ["DELETE"]
    pattern: '/agenda/:eventId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { eventId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/agenda_controller').default['destroy']>>>
    }
  }
  'agenda.pauses.store': {
    methods: ["POST"]
    pattern: '/agenda/:eventId/pauses'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/agenda').agendaPauseValidator)>>
      paramsTuple: [ParamValue]
      params: { eventId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/agenda').agendaPauseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/agenda_controller').default['storePause']>>>
    }
  }
  'agenda.pauses.destroy': {
    methods: ["DELETE"]
    pattern: '/agenda/:eventId/pauses/:pauseId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { eventId: ParamValue; pauseId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/agenda_controller').default['destroyPause']>>>
    }
  }
  'today.index': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/todays_controller').default['index']>>>
    }
  }
  'today.completions.store': {
    methods: ["POST"]
    pattern: '/agenda-items/:itemId/completions'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { itemId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/todays_controller').default['storeCompletion']>>>
    }
  }
  'today.completions.destroy': {
    methods: ["DELETE"]
    pattern: '/agenda-items/:itemId/completions/:completionId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { itemId: ParamValue; completionId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/todays_controller').default['destroyCompletion']>>>
    }
  }
  'journal.index': {
    methods: ["GET","HEAD"]
    pattern: '/journal'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/journal_controller').default['index']>>>
    }
  }
  'journal.store': {
    methods: ["POST"]
    pattern: '/journal'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/journal').journalValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/journal').journalValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/journal_controller').default['store']>>>
    }
  }
  'journal.destroy': {
    methods: ["DELETE"]
    pattern: '/journal/:journalId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { journalId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/journal_controller').default['destroy']>>>
    }
  }
  'counters.index': {
    methods: ["GET","HEAD"]
    pattern: '/counters'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/counters_controller').default['index']>>>
    }
  }
  'counters.store': {
    methods: ["POST"]
    pattern: '/counters'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/counter').counterValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/counter').counterValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/counters_controller').default['store']>>>
    }
  }
  'counters.increment': {
    methods: ["PATCH"]
    pattern: '/counters/:counterId/increment'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { counterId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/counters_controller').default['increment']>>>
    }
  }
  'counters.decrement': {
    methods: ["PATCH"]
    pattern: '/counters/:counterId/decrement'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { counterId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/counters_controller').default['decrement']>>>
    }
  }
  'counters.reset': {
    methods: ["PATCH"]
    pattern: '/counters/:counterId/reset'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { counterId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/counters_controller').default['reset']>>>
    }
  }
  'counters.update': {
    methods: ["PUT"]
    pattern: '/counters/:counterId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/counter').counterValidator)>>
      paramsTuple: [ParamValue]
      params: { counterId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/counter').counterValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/counters_controller').default['update']>>>
    }
  }
  'counters.destroy': {
    methods: ["DELETE"]
    pattern: '/counters/:counterId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { counterId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/counters_controller').default['destroy']>>>
    }
  }
  'shoppings.index': {
    methods: ["GET","HEAD"]
    pattern: '/shopping'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shoppings_controller').default['index']>>>
    }
  }
  'shoppings.store': {
    methods: ["POST"]
    pattern: '/shopping'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/shopping').shoppingValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/shopping').shoppingValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shoppings_controller').default['store']>>>
    }
  }
  'shoppings.mark_as_done': {
    methods: ["PATCH"]
    pattern: '/shopping/:shoppingItemId/done'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { shoppingItemId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shoppings_controller').default['markAsDone']>>>
    }
  }
  'shoppings.mark_as_undone': {
    methods: ["PATCH"]
    pattern: '/shopping/:shoppingItemId/undone'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { shoppingItemId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shoppings_controller').default['markAsUndone']>>>
    }
  }
  'shoppings.pin': {
    methods: ["PATCH"]
    pattern: '/shopping/:shoppingItemId/pin'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { shoppingItemId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shoppings_controller').default['pin']>>>
    }
  }
  'shoppings.un_pin': {
    methods: ["PATCH"]
    pattern: '/shopping/:shoppingItemId/unpin'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { shoppingItemId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shoppings_controller').default['unPin']>>>
    }
  }
  'shoppings.update': {
    methods: ["PUT"]
    pattern: '/shopping/:shoppingItemId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/shopping').shoppingValidator)>>
      paramsTuple: [ParamValue]
      params: { shoppingItemId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/shopping').shoppingValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shoppings_controller').default['update']>>>
    }
  }
  'shoppings.destroy': {
    methods: ["DELETE"]
    pattern: '/shopping/:shoppingItemId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { shoppingItemId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shoppings_controller').default['destroy']>>>
    }
  }
  'stats.index': {
    methods: ["GET","HEAD"]
    pattern: '/stats'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/stats_controller').default['index']>>>
    }
  }
  'page.login': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
    }
  }
  'page.register': {
    methods: ["GET","HEAD"]
    pattern: '/register'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
    }
  }
  'auth.login': {
    methods: ["POST"]
    pattern: '/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/session').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/session').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['login']>>>
    }
  }
  'auth.register': {
    methods: ["POST"]
    pattern: '/auth/register'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/session').registerValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/session').registerValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['register']>>>
    }
  }
  'session.logout': {
    methods: ["DELETE"]
    pattern: '/auth'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['logout']>>>
    }
  }
}
