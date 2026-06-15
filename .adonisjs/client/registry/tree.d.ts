/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  agenda: {
    index: typeof routes['agenda.index']
    store: typeof routes['agenda.store']
    update: typeof routes['agenda.update']
    destroy: typeof routes['agenda.destroy']
    pauses: {
      store: typeof routes['agenda.pauses.store']
      destroy: typeof routes['agenda.pauses.destroy']
    }
  }
  today: {
    index: typeof routes['today.index']
    completions: {
      store: typeof routes['today.completions.store']
      destroy: typeof routes['today.completions.destroy']
    }
  }
  journal: {
    index: typeof routes['journal.index']
    store: typeof routes['journal.store']
    destroy: typeof routes['journal.destroy']
  }
  counters: {
    index: typeof routes['counters.index']
    store: typeof routes['counters.store']
    increment: typeof routes['counters.increment']
    decrement: typeof routes['counters.decrement']
    reset: typeof routes['counters.reset']
    update: typeof routes['counters.update']
    destroy: typeof routes['counters.destroy']
  }
  shoppings: {
    index: typeof routes['shoppings.index']
    store: typeof routes['shoppings.store']
    markAsDone: typeof routes['shoppings.mark_as_done']
    markAsUndone: typeof routes['shoppings.mark_as_undone']
    pin: typeof routes['shoppings.pin']
    unPin: typeof routes['shoppings.un_pin']
    update: typeof routes['shoppings.update']
    destroy: typeof routes['shoppings.destroy']
  }
  stats: {
    index: typeof routes['stats.index']
  }
  page: {
    login: typeof routes['page.login']
    register: typeof routes['page.register']
  }
  auth: {
    login: typeof routes['auth.login']
    register: typeof routes['auth.register']
  }
  session: {
    logout: typeof routes['session.logout']
  }
}
