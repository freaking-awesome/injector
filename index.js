/**
 * @module Injector
 * @author awsmtek.com
 *
 * Инъектор зависимостей.
 *
 * @license Public Domain
 */
module.exports= Injector





/**
 * @name Injector
 * @description Конструктор объектов — экземпляров класса Injector.
 *
 * @constructor
 */
function Injector() {

    if (!(this instanceof Injector)) {
        return new Injector
    }

    this.factories= {}
}





/**
 * Объявляет зависимость
 *
 * @memberOf Injector
 * @method set
 *
 * @public
 * @chainable
 *
 * @this {Injector}
 * @param {String} name — имя зависимости
 * @param {Function|Mixed} factory — фабрика зависимости или значение
 * @return {Injector} — возвращает себя (chainable)
 */
Injector.prototype.set= Injector.prototype.factory= function (name, fn) {
    if (name) {
        if (!(typeof fn === 'function')) {
            var value= fn
            fn= function () {
                return value
            }
        }
        fn.$inject= fn.$inject || annotate(fn)
        this.factories[name]= fn
    }
    this.$resolved= null
    return this
}

/**
 * Разрешает и возвращает зависимость
 *
 * @memberOf Injector
 * @method get
 *
 * @public
 * @chainable
 *
 * @this {Injector}
 * @param {String} name — имя зависимости
 * @return {Mixed}
 */
Injector.prototype.get= function (name) {
    return get(name, this)
}

/**
 * Проверяет наличие объявления зависимости
 *
 * @memberOf Injector
 * @method has
 *
 * @public
 * @chainable
 *
 * @this {Injector}
 * @param {String} name — имя зависимости
 * @return {Boolean}
 */
Injector.prototype.has= function (name) {
    return !!this.factories[name]
}



/**
 * Разрешает зависимости функции и выполняет ее
 *
 * @memberOf Injector
 * @method invoke
 *
 * @public
 * @chainable
 *
 * @this {Injector}
 * @param {Function} fn
 * @return {Mixed}
 */
Injector.prototype.invoke= function (fn) {
    fn.$inject= fn.$inject || annotate(fn)
    return invoke(fn, this)
}

/**
 * Разрешает зависимости функции и инстанцирует ее
 *
 * @memberOf Injector
 * @method instantiate
 *
 * @public
 * @chainable
 *
 * @this {Injector}
 * @param {Function} fn
 * @return {Mixed}
 */
Injector.prototype.instantiate= function (fn) {
    var func= function () {
        var args= [null].concat(
            Array.prototype.slice.call(arguments)
        )
        var constructor= fn.bind.apply(fn, args)
        return new constructor()
    }
    func.$inject= fn.$inject || annotate(fn)
    return this.invoke(func)
}





function annotate(fn) {
    var FN_ARGS        = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
        FN_ARG_SPLIT   = /,/,
        FN_ARG         = /^\s*(_?)(\S+?)\1\s*$/,
        STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
    var inject= []
    var args= fn.toString().replace(STRIP_COMMENTS, '').match(FN_ARGS)
    args[1].split(FN_ARG_SPLIT).forEach(function(arg) {
        arg.replace(FN_ARG, function(all, underscore, name) {
            inject.push(name)
        })
    })
    return inject
}



function get(name, injector, $resolving) {
    injector.$resolved= injector.$resolved || {}
    var factory= injector.factories[name]
    if (!(factory)) {
        throw new Error(
            ['dependency undefined:', name].join(' ')
        )
    }
    var value= injector.$resolved[name]
    if (!(value)) {
        $resolving= $resolving || []
        if ($resolving.indexOf(name) !== -1) {
            throw new Error(
                ['dependency cyclic:', name].join(' ')
            )
        }
        $resolving.push(name)
        value= invoke(factory, injector, $resolving)
        injector.$resolved[name]= value
    }
    return value
}



function invoke(factory, injector, $resolving) {
    var values= Object.keys(factory.$inject).map(function (key) {
        var name= factory.$inject[key]
        var value= get(name, injector, $resolving)
        return value
    })
    return factory.apply(this, values)
}
