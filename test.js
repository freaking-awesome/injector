var tests= require('./tests/Injector')



describe('Injector example', function () { it('readme', function (done) {



    //
    // Подключение...
    //

    var Injector= require('./index') // require('injector')



    //
    // Использование...
    //

    var injector= new Injector // инстанцирование экземпляра

    // определение зависимостей

    injector.set('A', function () {
        console.log('factory', 'A', arguments)
        return 'a'
    })

    injector.set('B', function (A) {
        console.log('factory', 'B', arguments)
        return 'b'
    })

    injector.set('C', function (A, B) {
        console.log('factory', 'C', arguments)
        return 'c'
    })

    // получение зависимостей

    var A= injector.get('A')
    console.assert(A == 'a')

    var B= injector.get('B')
    console.assert(B == 'b')

    var C= injector.get('C')
    console.assert(C == 'c')

    // выполнение функций с разрешением зависимостей

    injector.invoke(function (A, B) {
        console.assert(A && B)
    })

    injector.set('A', function () {
         return 'a1'
    })

    injector.invoke(function (A, B, C) {
        console.assert(A && B && C)
    })

    // инстанцирование функций с разрешением зависимостей

    var Alphabet= function (A, B, C) {
        console.assert(A && B && C)
    }
    var alphabet= injector.instantiate(Alphabet)
    console.assert(alphabet instanceof Alphabet)

    // переопределение зависимостей

    var A= injector.get('A')
    console.assert(A == 'a1')

    injector.set('A', 'a2')

    var A= injector.get('A')
    console.assert(A == 'a2')



    done()

})})
