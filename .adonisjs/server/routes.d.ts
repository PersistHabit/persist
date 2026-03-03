import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'agenda.index': { paramsTuple?: []; params?: {} }
    'agenda.store': { paramsTuple?: []; params?: {} }
    'agenda.update': { paramsTuple: [ParamValue]; params: {'eventId': ParamValue} }
    'agenda.destroy': { paramsTuple: [ParamValue]; params: {'eventId': ParamValue} }
    'agenda.pauses.store': { paramsTuple: [ParamValue]; params: {'eventId': ParamValue} }
    'agenda.pauses.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'eventId': ParamValue,'pauseId': ParamValue} }
    'today.index': { paramsTuple?: []; params?: {} }
    'today.completions.store': { paramsTuple: [ParamValue]; params: {'itemId': ParamValue} }
    'today.completions.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'itemId': ParamValue,'completionId': ParamValue} }
    'journal.index': { paramsTuple?: []; params?: {} }
    'journal.store': { paramsTuple?: []; params?: {} }
    'counters.index': { paramsTuple?: []; params?: {} }
    'counters.store': { paramsTuple?: []; params?: {} }
    'counters.increment': { paramsTuple: [ParamValue]; params: {'counterId': ParamValue} }
    'counters.decrement': { paramsTuple: [ParamValue]; params: {'counterId': ParamValue} }
    'counters.reset': { paramsTuple: [ParamValue]; params: {'counterId': ParamValue} }
    'counters.update': { paramsTuple: [ParamValue]; params: {'counterId': ParamValue} }
    'counters.destroy': { paramsTuple: [ParamValue]; params: {'counterId': ParamValue} }
    'page.login': { paramsTuple?: []; params?: {} }
    'page.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'session.logout': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'agenda.index': { paramsTuple?: []; params?: {} }
    'today.index': { paramsTuple?: []; params?: {} }
    'journal.index': { paramsTuple?: []; params?: {} }
    'counters.index': { paramsTuple?: []; params?: {} }
    'page.login': { paramsTuple?: []; params?: {} }
    'page.register': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'agenda.index': { paramsTuple?: []; params?: {} }
    'today.index': { paramsTuple?: []; params?: {} }
    'journal.index': { paramsTuple?: []; params?: {} }
    'counters.index': { paramsTuple?: []; params?: {} }
    'page.login': { paramsTuple?: []; params?: {} }
    'page.register': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'agenda.store': { paramsTuple?: []; params?: {} }
    'agenda.pauses.store': { paramsTuple: [ParamValue]; params: {'eventId': ParamValue} }
    'today.completions.store': { paramsTuple: [ParamValue]; params: {'itemId': ParamValue} }
    'journal.store': { paramsTuple?: []; params?: {} }
    'counters.store': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'agenda.update': { paramsTuple: [ParamValue]; params: {'eventId': ParamValue} }
    'counters.update': { paramsTuple: [ParamValue]; params: {'counterId': ParamValue} }
  }
  DELETE: {
    'agenda.destroy': { paramsTuple: [ParamValue]; params: {'eventId': ParamValue} }
    'agenda.pauses.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'eventId': ParamValue,'pauseId': ParamValue} }
    'today.completions.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'itemId': ParamValue,'completionId': ParamValue} }
    'counters.destroy': { paramsTuple: [ParamValue]; params: {'counterId': ParamValue} }
    'session.logout': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'counters.increment': { paramsTuple: [ParamValue]; params: {'counterId': ParamValue} }
    'counters.decrement': { paramsTuple: [ParamValue]; params: {'counterId': ParamValue} }
    'counters.reset': { paramsTuple: [ParamValue]; params: {'counterId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}